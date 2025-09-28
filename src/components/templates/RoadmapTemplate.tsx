import React, { useState } from 'react';
import { Plus, Calendar, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask } from '../../types';

const RoadmapTemplate: React.FC = () => {
  const { roadmapTasks, addRoadmapTask, updateRoadmapTask, deleteRoadmapTask } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate statistics
  const completedTasks = roadmapTasks.filter(task => task.status === 'Abgeschlossen').length;
  const inProgressTasks = roadmapTasks.filter(task => task.status === 'In Arbeit').length;
  const notStartedTasks = roadmapTasks.filter(task => task.status === 'Nicht begonnen').length;
  const overallProgress = roadmapTasks.length > 0 
    ? Math.round(roadmapTasks.reduce((sum, task) => sum + task.progress, 0) / roadmapTasks.length)
    : 0;

  const handleProgressChange = (taskId: string, progress: number) => {
    updateRoadmapTask(taskId, { progress });
  };

  const handleStatusChange = (taskId: string, status: RoadmapTask['status']) => {
    const progress = status === 'Abgeschlossen' ? 100 : status === 'In Arbeit' ? 50 : 0;
    updateRoadmapTask(taskId, { status, progress });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Planung':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Design':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Entwicklung':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Abgeschlossen':
        return 'text-green-600 dark:text-green-400';
      case 'In Arbeit':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Nicht begonnen':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Projekt-Roadmap</h1>
        <p className="text-gray-600 dark:text-gray-400">Verfolgen Sie Ihre Projektmeilensteine und Fortschritte</p>
      </div>

      {/* Statistics Bar */}
      <div className="px-8 py-6 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Abgeschlossene Aufgaben</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Aufgaben in Arbeit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{notStartedTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Nicht begonnene Aufgaben</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallProgress}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Gesamtfortschritt</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Add Milestone Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Meilenstein hinzufügen
          </button>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {roadmapTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mr-3">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {task.startDate} - {task.endDate}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteRoadmapTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fortschritt</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.progress}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${task.progress}%, #e5e7eb ${task.progress}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center justify-between">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as RoadmapTask['status'])}
                  className={`px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-medium ${getStatusColor(task.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Nicht begonnen">Nicht begonnen</option>
                  <option value="In Arbeit">In Arbeit</option>
                  <option value="Abgeschlossen">Abgeschlossen</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && <AddMilestoneModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddMilestoneModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addRoadmapTask } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Planung' as RoadmapTask['category'],
    startDate: '',
    endDate: '',
    progress: 0,
    status: 'Nicht begonnen' as RoadmapTask['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addRoadmapTask(formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Neuen Meilenstein hinzufügen</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Beschreibung
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            >
              <option value="Planung">Planung</option>
              <option value="Design">Design</option>
              <option value="Entwicklung">Entwicklung</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Startdatum
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enddatum
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Meilenstein hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoadmapTemplate;
