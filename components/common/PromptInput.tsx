
import React from 'react';
import { SparklesIcon } from '../icons/SparklesIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onPromptEnhance: () => void;
  placeholder: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onPromptEnhance, placeholder }) => {
  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full p-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
      />
      <button
        onClick={onPromptEnhance}
        title="Enhance Prompt"
        className="absolute top-3 right-3 p-1.5 bg-gray-600/70 rounded-full text-purple-300 hover:bg-purple-500 hover:text-white transition-all duration-200"
      >
        <SparklesIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PromptInput;
