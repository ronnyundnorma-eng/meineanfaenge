import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface IconPickerProps {
  onSelect: (icon: string) => void;
}

const emojiCategories = {
  'Smileys & Emotionen': ['😀', '😂', '😍', '🤔', '😢', '😡', '🤩', '🥳', '🤯', '😭', '😱', '😇'],
  'Menschen & Körper': ['👋', '👍', '🙏', '💪', '👀', '🧠', '🧑‍💻', '👩‍🎨', '👨‍🚀', '🦸‍♂️', '🏃‍♀️', '💃'],
  'Tiere & Natur': ['🐶', '🐱', '🐭', '🌍', '🌳', '🌸', '🐳', '🦋', '⭐', '🔥', '💧', '⚡'],
  'Essen & Trinken': ['🍎', '🍌', '🍕', '🍔', '☕️', '🍺', '🍇', '🍓', '🥑', '🌮', '🍣', '🍩'],
  'Reisen & Orte': ['✈️', '🚗', '🏠', '🚀', '🗺️', '🏛️', '🗼', '🗽', '🏝️', '⛰️', '🏕️', '🏟️'],
  'Aktivitäten': ['⚽️', '🏀', '🎨', '🎵', '🎮', '🎉', '🏆', '🎯', '🎬', '🎤', '🎸', '📚'],
  'Objekte': ['💻', '📱', '💡', '🔔', '✏️', '📎', '🔑', '💰', '💎', '⚙️', '🔬', '🔭'],
  'Symbole': ['❤️', '✅', '❌', '❓', '❗️', '💯', '➕', '➖', '➗', '✖️', '©️', '®️']
};

const allEmojis = Object.values(emojiCategories).flat();

const IconPicker: React.FC<IconPickerProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmojis = searchTerm
    ? allEmojis.filter(emoji => 
        emoji.codePointAt(0)?.toString(16).includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl w-80 h-96 flex flex-col">
      <div className="p-2 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Emoji suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {searchTerm ? (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => onSelect(emoji)}
                className="text-2xl p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => onSelect(emoji)}
                      className="text-2xl p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconPicker;
