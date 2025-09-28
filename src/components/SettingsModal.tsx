import React, { useState, useEffect } from 'react';
import { X, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDarkMode } from '../hooks/useDarkMode';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { workspace, updateWorkspaceName } = useApp();
  const [theme, toggleTheme] = useDarkMode();
  const [workspaceName, setWorkspaceName] = useState(workspace.name);

  useEffect(() => {
    setWorkspaceName(workspace.name);
  }, [workspace.name, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (workspaceName.trim()) {
      updateWorkspaceName(workspaceName.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg mx-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Settings className="text-gray-500 dark:text-gray-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Einstellungen
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="text-gray-500 dark:text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Workspace Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name des Arbeitsbereichs
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Dark Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Erscheinungsbild
            </label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md"
            >
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'light' ? 'Heller Modus' : 'Dunkler Modus'}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Umschalten</span>
            </button>
          </div>
          
          {/* Language Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sprache
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                defaultValue="de"
              >
                <option value="de">Deutsch</option>
                <option value="en" disabled>Englisch (bald verfügbar)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
