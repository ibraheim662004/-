
import React from 'react';
import { Tool, Asset } from '../../types';
import PromptInput from '../common/PromptInput';

interface ImageEditPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (tool: Tool, settings: any) => void;
  isLoading: boolean;
  currentAsset: Asset | null;
  onPromptEnhance: () => void;
}

const ImageEditPanel: React.FC<ImageEditPanelProps> = (
    { prompt, setPrompt, onGenerate, isLoading, currentAsset, onPromptEnhance }
) => {

  const editingOptions = [
    { name: "Add/Remove Object", prompt: "Add a [object]..." },
    { name: "Change Background", prompt: "Change the background to a [scene]..." },
    { name: "Face Retouch", prompt: "Retouch and enhance the face to look more professional" },
    { name: "Change Lighting", prompt: "Change the lighting to [e.g., golden hour, dramatic studio lighting]" },
    { name: "Restore Photo", prompt: "Restore this old photo, remove scratches, and enhance colors" },
    { name: "Upscale to 4K", prompt: "Upscale this image to 4K resolution, enhancing details" },
  ];

  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Image Editing</h3>
            <p className="text-sm text-gray-400 mb-4">You've loaded an image. Describe the changes you want to make.</p>
        </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Editing Prompt</label>
        <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onPromptEnhance={onPromptEnhance}
            placeholder="Add a cat wearing sunglasses..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Quick Actions</label>
        <div className="grid grid-cols-2 gap-2">
            {editingOptions.map(opt => (
                <button key={opt.name} onClick={() => setPrompt(opt.prompt)} className="p-2 text-xs text-left bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                    {opt.name}
                </button>
            ))}
        </div>
      </div>
      
      <button
        onClick={() => onGenerate(Tool.IMAGE_EDIT, {})}
        disabled={isLoading || !prompt || !currentAsset}
        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Applying Edits...' : 'Apply Edits'}
      </button>
    </div>
  );
};

export default ImageEditPanel;
