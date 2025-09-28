import React from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { useDarkMode } from './hooks/useDarkMode';

const App: React.FC = () => {
  useDarkMode(); // Initialize dark mode hook to apply theme on load

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default App;
