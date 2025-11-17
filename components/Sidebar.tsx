
import React from 'react';
import { Asset, View } from '../types';
import ImageGenPanel from './panels/ImageGenPanel';
import VideoGenPanel from './panels/VideoGenPanel';
import ImageEditPanel from './panels/ImageEditPanel';
import HistoryPanel from './panels/HistoryPanel';
import { ImageIcon } from './icons/ImageIcon';
import { VideoIcon } from './icons/VideoIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  onGenerate: (tool: any, settings: any) => void;
  isLoading: boolean;
  history: Asset[];
  onSelectFromHistory: (asset: Asset) => void;
  currentAsset: Asset | null;
  onPromptEnhance: () => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 p-3 rounded-lg w-full transition-colors duration-200 ${
        isActive ? 'bg-purple-600/30 text-purple-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = (props) => {
  const { view, setView } = props;

  const renderPanel = () => {
    switch (view) {
      case View.IMAGE_GEN:
        return <ImageGenPanel {...props} />;
      case View.IMAGE_EDIT:
        return <ImageEditPanel {...props} />;
      case View.VIDEO_GEN:
      case View.VIDEO_EDIT:
        return <VideoGenPanel {...props} />;
      case View.HISTORY:
        return <HistoryPanel {...props} />;
      default:
        return <ImageGenPanel {...props} />;
    }
  };

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] bg-gray-800/60 border-r border-gray-700/50 flex flex-col h-full">
        <nav className="flex items-center justify-around p-2 bg-gray-900/50 border-b border-gray-700/50">
             <NavItem icon={<ImageIcon className="w-6 h-6" />} label="Image" isActive={view === View.IMAGE_GEN || view === View.IMAGE_EDIT} onClick={() => setView(View.IMAGE_GEN)} />
             <NavItem icon={<VideoIcon className="w-6 h-6" />} label="Video" isActive={view === View.VIDEO_GEN || view === View.VIDEO_EDIT} onClick={() => setView(View.VIDEO_GEN)} />
             <NavItem icon={<HistoryIcon className="w-6 h-6" />} label="History" isActive={view === View.HISTORY} onClick={() => setView(View.HISTORY)} />
        </nav>
      <div className="flex-1 overflow-y-auto p-4">
        {renderPanel()}
      </div>
    </aside>
  );
};

export default Sidebar;
