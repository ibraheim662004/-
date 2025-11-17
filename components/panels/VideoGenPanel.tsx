
import React, { useState } from 'react';
import { Tool, Asset, View } from '../../types';
import PromptInput from '../common/PromptInput';

interface VideoGenPanelProps {
  view: View;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (tool: Tool, settings: any) => void;
  isLoading: boolean;
  onPromptEnhance: () => void;
  currentAsset: Asset | null;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

const aspectRatios = ['16:9', '9:16'];

const VideoGenPanel: React.FC<VideoGenPanelProps> = (
    { view, prompt, setPrompt, onGenerate, isLoading, onPromptEnhance, currentAsset, aspectRatio, setAspectRatio }
) => {

  const tool = view === View.VIDEO_EDIT ? Tool.VIDEO_EDIT : Tool.VIDEO_GEN;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
            {view === View.VIDEO_GEN ? 'Video Generation' : 'Video Editing'}
        </h3>
        {currentAsset && <p className="text-sm text-gray-400 mb-4">An asset is loaded. Your prompt will modify it.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
        <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onPromptEnhance={onPromptEnhance} 
            placeholder="A cinematic drone shot over a futuristic city..."
        />
      </div>
      <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
              {aspectRatios.map(ratio => (
                  <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`p-2 rounded-md text-sm transition-colors ${aspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                      {ratio}
                  </button>
              ))}
          </div>
      </div>
      <button
        onClick={() => onGenerate(tool, { aspectRatio })}
        disabled={isLoading || !prompt}
        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
      <div className="text-xs text-center text-gray-500 pt-2">
        Note: Video generation can take several minutes.
      </div>
    </div>
  );
};

export default VideoGenPanel;
