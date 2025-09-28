import React from 'react';
import { BlockType } from '../types';

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  blockTypes: BlockType[];
  selectedIndex: number;
  onSelect: (blockType: BlockType) => void;
  onClose: () => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  position,
  blockTypes,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div
      className="absolute z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[250px] max-h-80 overflow-y-auto"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
        BLÖCKE
      </div>
      {blockTypes.map((blockType, index) => (
        <button
          key={blockType.type}
          onClick={() => onSelect(blockType)}
          className={`w-full flex items-center px-3 py-2 text-left transition-colors ${
            index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          <span className="mr-3 text-lg flex-shrink-0">{blockType.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{blockType.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{blockType.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SlashCommandMenu;
