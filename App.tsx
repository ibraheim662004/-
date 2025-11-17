
import React, { useState, useCallback, useEffect } from 'react';
import { Asset, Tool, View } from './types';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import { generateImage, generateVideo, editImage, generateCreativePrompts } from './services/geminiService';

// FIX: Removed conflicting global declaration for `window.aistudio`.
// The error "Subsequent property declarations must have the same type" indicates that a global type for `window.aistudio`
// already exists in the project. This local declaration was conflicting with the existing one. By removing it,
// the component will correctly use the globally available type definition for window.aistudio.

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.IMAGE_GEN);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [history, setHistory] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const checkApiKey = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const selected = await window.aistudio.hasSelectedApiKey();
      setIsApiKeySelected(selected);
      return selected;
    }
    return false;
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleFileDrop = useCallback((file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentAsset({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: reader.result as string,
        prompt: 'Uploaded file',
      });
    };
    reader.readAsDataURL(file);
    if(view === View.IMAGE_GEN) setView(View.IMAGE_EDIT);
    else if(view === View.VIDEO_GEN) setView(View.VIDEO_EDIT);
  }, [view]);

  const addToHistory = (asset: Asset) => {
    setHistory(prev => [asset, ...prev.slice(0, 19)]);
  };

  const handleGenerate = useCallback(async (tool: Tool, settings: any) => {
    setIsLoading(true);
    try {
      let newAsset: Asset | null = null;
      if (tool === Tool.IMAGE_GEN) {
        setLoadingMessage('Forging a new vision...');
        const base64Image = await generateImage(prompt, settings.aspectRatio, settings.style, negativePrompt);
        newAsset = { type: 'image', url: `data:image/jpeg;base64,${base64Image}`, prompt };
      } else if (tool === Tool.VIDEO_GEN) {
        if (!isApiKeySelected) {
          const selected = await checkApiKey();
          if (!selected) {
            setIsApiKeyModalOpen(true);
            setIsLoading(false);
            return;
          }
        }
        const onProgress = (message: string) => setLoadingMessage(message);
        const videoUri = await generateVideo(prompt, settings.aspectRatio, null, onProgress);
        const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        newAsset = { type: 'video', url: videoUrl, prompt };
      } else if (tool === Tool.IMAGE_EDIT && currentAsset?.url) {
        setLoadingMessage('Re-imagining your image...');
        const base64Image = await editImage(prompt, currentAsset.url);
        newAsset = { type: 'image', url: `data:image/png;base64,${base64Image}`, prompt };
      }

      if (newAsset) {
        setCurrentAsset(newAsset);
        addToHistory(newAsset);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      if(error instanceof Error && error.message.includes("Requested entity was not found.")){
        setIsApiKeySelected(false);
        setIsApiKeyModalOpen(true);
      }
      // You could add a user-facing error message here
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, negativePrompt, currentAsset, isApiKeySelected, checkApiKey]);

  const handleSelectFromHistory = (asset: Asset) => {
    setCurrentAsset(asset);
    setPrompt(asset.prompt);
    if (asset.type === 'image') {
      setView(View.IMAGE_EDIT);
    } else {
      setView(View.VIDEO_EDIT);
    }
  };
  
  const handlePromptEnhance = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setLoadingMessage('Thinking of better prompts...');
        try {
            const enhancedPrompts = await generateCreativePrompts(prompt);
            // For simplicity, we'll just take the first one. A real app might show a list.
            if (enhancedPrompts.length > 0) {
                setPrompt(enhancedPrompts[0]);
            }
        } catch (error) {
            console.error("Failed to enhance prompt:", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          view={view}
          setView={setView}
          prompt={prompt}
          setPrompt={setPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          history={history}
          onSelectFromHistory={handleSelectFromHistory}
          currentAsset={currentAsset}
          onPromptEnhance={handlePromptEnhance}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
        />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 bg-gray-800/50 overflow-y-auto">
          <Canvas
            asset={currentAsset}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onFileDrop={handleFileDrop}
            aspectRatio={aspectRatio}
          />
        </main>
      </div>
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSelectKey={async () => {
          if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setIsApiKeyModalOpen(false);
            setIsApiKeySelected(true); // Assume success to avoid race condition
          }
        }}
      />
    </div>
  );
};

export default App;
