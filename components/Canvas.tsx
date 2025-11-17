
import React, { useCallback } from 'react';
import { Asset } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface CanvasProps {
  asset: Asset | null;
  isLoading: boolean;
  loadingMessage: string;
  onFileDrop: (file: File) => void;
  aspectRatio: string;
}

const Canvas: React.FC<CanvasProps> = ({ asset, isLoading, loadingMessage, onFileDrop, aspectRatio }) => {

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileDrop]);
  
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  }

  return (
    <div 
      className="flex-1 w-full h-full flex items-center justify-center p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`relative w-full max-w-4xl max-h-full rounded-xl bg-gray-900/50 border-2 border-dashed border-gray-600/80 flex items-center justify-center transition-all duration-300 ${getAspectRatioClass()}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-xl">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-200">{loadingMessage || 'Generating...'}</p>
          </div>
        )}
        
        {!asset && !isLoading && (
          <div className="text-center text-gray-400 p-8">
            <UploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Your vision appears here</h3>
            <p>Generate an image or video, or drag and drop a file to start editing.</p>
          </div>
        )}

        {asset && asset.type === 'image' && (
          <img src={asset.url} alt={asset.prompt} className="w-full h-full object-contain rounded-xl" />
        )}
        {asset && asset.type === 'video' && (
          <video src={asset.url} controls autoPlay loop className="w-full h-full object-contain rounded-xl" />
        )}

        {asset && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
                <a href={asset.url} download={`visionforge_${Date.now()}.${asset.type === 'image' ? 'png' : 'mp4'}`} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-semibold">
                    Download
                </a>
            </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
