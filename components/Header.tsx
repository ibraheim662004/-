
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900/80 border-b border-gray-700/50 backdrop-blur-sm shadow-md">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          VisionForge <span className="text-purple-400">Studio</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors">
          Projects
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
          Upgrade
        </button>
      </div>
    </header>
  );
};

export default Header;
