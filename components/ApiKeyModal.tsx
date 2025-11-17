
import React from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKey: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSelectKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full m-4 transform transition-all">
        <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
        <p className="text-gray-400 mb-6">
          Video generation with Veo requires a user-selected API key. Please select your key to proceed.
          This ensures that usage is associated with your project.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          For more information on billing and API keys, please visit the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            official documentation
          </a>.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSelectKey}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
