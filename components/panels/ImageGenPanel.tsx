
import React, { useState } from 'react';
import { Tool } from '../../types';
import PromptInput from '../common/PromptInput';

interface ImageGenPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  onGenerate: (tool: Tool, settings: any) => void;
  isLoading: boolean;
  onPromptEnhance: () => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

const stylePresets = [
    'Photorealistic', 'Cinematic', 'Fantasy', 'Anime', 'Futuristic', 'Oil Painting', 'Pixel Art'
];

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const ImageGenPanel: React.FC<ImageGenPanelProps> = (
    { prompt, setPrompt, negativePrompt, setNegativePrompt, onGenerate, isLoading, onPromptEnhance, aspectRatio, setAspectRatio }
) => {
    const [style, setStyle] = useState('Photorealistic');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
        <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onPromptEnhance={onPromptEnhance} 
            placeholder="A vibrant cyberpunk city street at night..." 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Negative Prompt (Optional)</label>
        <input 
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="e.g., blurry, watermark, text"
            className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-5 gap-2">
              {aspectRatios.map(ratio => (
                  <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`p-2 rounded-md text-sm transition-colors ${aspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                      {ratio}
                  </button>
              ))}
          </div>
      </div>
      <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Style Preset</label>
          <div className="grid grid-cols-3 gap-2">
              {stylePresets.map(preset => (
                  <button key={preset} onClick={() => setStyle(preset)} className={`p-2 rounded-md text-xs transition-colors ${style === preset ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                      {preset}
                  </button>
              ))}
          </div>
      </div>
      <button
        onClick={() => onGenerate(Tool.IMAGE_GEN, { style, aspectRatio })}
        disabled={isLoading || !prompt}
        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
};

export default ImageGenPanel;
