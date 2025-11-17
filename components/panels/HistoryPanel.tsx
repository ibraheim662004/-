
import React from 'react';
import { Asset } from '../../types';
import { PlayIcon } from '../icons/PlayIcon';

interface HistoryPanelProps {
  history: Asset[];
  onSelectFromHistory: (asset: Asset) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectFromHistory }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Generation History</h3>
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">Your generated images and videos will appear here.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {history.map((asset, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden"
              onClick={() => onSelectFromHistory(asset)}
            >
              {asset.type === 'image' && (
                <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover" />
              )}
              {asset.type === 'video' && (
                <>
                  <video src={asset.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayIcon className="w-8 h-8 text-white/80" />
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs line-clamp-2">{asset.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
