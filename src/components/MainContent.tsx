import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import BlockEditor from './BlockEditor';
import RoadmapTemplate from './templates/RoadmapTemplate';
import CalendarTemplate from './templates/CalendarTemplate';
import IconPicker from './IconPicker';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SmilePlus } from 'lucide-react';

const MainContent: React.FC = () => {
  const { pages, templates, selectedPageId, selectedTemplateId, isSidebarCollapsed, updatePageIcon } = useApp();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(iconPickerRef, () => setIsIconPickerOpen(false), iconButtonRef);

  const mainContentClasses = `flex-1 bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-0' : ''}`;

  // If a template is selected
  if (selectedTemplateId) {
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    
    if (selectedTemplate?.type === 'roadmap') {
      return <RoadmapTemplate />;
    } else if (selectedTemplate?.type === 'calendar') {
      return <CalendarTemplate />;
    }
  }

  // If a page is selected
  const selectedPage = pages.find(page => page.id === selectedPageId);

  if (!selectedPage) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-0' : ''
      }`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">Keine Seite ausgewählt</p>
          <p className="text-sm">Wählen Sie eine Seite aus der Seitenleiste, um zu beginnen</p>
        </div>
      </div>
    );
  }

  const handleIconSelect = (icon: string) => {
    updatePageIcon(selectedPage.id, icon);
    setIsIconPickerOpen(false);
  };

  return (
    <div className={mainContentClasses}>
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <div className="relative mb-4">
          <button
            ref={iconButtonRef}
            onClick={() => setIsIconPickerOpen(prev => !prev)}
            className="hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg p-2 transition-colors"
          >
            {selectedPage.icon ? (
              <span className="text-5xl">{selectedPage.icon}</span>
            ) : (
              <div className="flex items-center text-gray-400 dark:text-gray-500 p-2">
                <SmilePlus size={24} className="mr-2" />
                <span className="text-sm font-medium">Icon hinzufügen</span>
              </div>
            )}
          </button>
          {isIconPickerOpen && (
            <div ref={iconPickerRef} className="absolute top-full mt-2 z-50">
              <IconPicker onSelect={handleIconSelect} />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {selectedPage.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Erstellt am {selectedPage.createdAt.toLocaleDateString('de-DE')}
        </p>
      </div>

      {/* Block Editor */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <BlockEditor key={selectedPage.id} pageId={selectedPage.id} />
      </div>
    </div>
  );
};

export default MainContent;
