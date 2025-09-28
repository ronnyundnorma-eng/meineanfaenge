import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

const CalendarTemplate: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: string) => {
    return calendarEvents.filter(event => event.date === date);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const dateString = formatDate(clickedDate);
    setSelectedDate(dateString);
    setShowAddModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const tagColors = [
    { name: 'Meeting', color: 'bg-blue-500' },
    { name: 'Überprüfung', color: 'bg-green-500' },
    { name: 'Planung', color: 'bg-purple-500' },
    { name: 'Deadline', color: 'bg-red-500' },
    { name: 'Persönlich', color: 'bg-yellow-500' },
  ];

  const renderCalendarGrid = () => {
    const days = [];
    const totalCells = 42; // 6 weeks × 7 days

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 p-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50"></div>
      );
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = formatDate(date);
      const events = getEventsForDate(dateString);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-slate-800'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{events.length - 2} mehr
              </div>
            )}
          </div>
        </div>
      );
    }

    // Fill remaining cells
    const remainingCells = totalCells - firstDayOfMonth - daysInMonth;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-24 p-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50"></div>
      );
    }

    return days;
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Kalender</h1>
            <p className="text-gray-600 dark:text-gray-400">Organisieren Sie Termine und Fristen</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Monat
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Woche
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-800 dark:text-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-800 dark:text-gray-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={() => {
            setSelectedDate(formatDate(new Date()));
            setShowAddModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Termin hinzufügen
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="px-8 py-6">
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="bg-gray-100 dark:bg-slate-900 p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
            {/* Calendar cells */}
            {renderCalendarGrid()}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <CalendarIcon size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">Wochenansicht bald verfügbar!</p>
            <p className="text-sm">Genießen Sie vorerst die Monatsansicht mit voller Funktionalität.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <EventModal
          event={editingEvent}
          selectedDate={selectedDate}
          tagColors={tagColors}
          onClose={() => {
            setShowAddModal(false);
            setEditingEvent(null);
            setSelectedDate('');
          }}
        />
      )}
    </div>
  );
};

const EventModal: React.FC<{
  event: CalendarEvent | null;
  selectedDate: string;
  tagColors: { name: string; color: string }[];
  onClose: () => void;
}> = ({ event, selectedDate, tagColors, onClose }) => {
  const { addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useApp();
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || selectedDate,
    time: event?.time || '09:00',
    tag: event?.tag || 'Meeting',
    color: event?.color || 'bg-blue-500'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (event) {
        updateCalendarEvent(event.id, formData);
      } else {
        addCalendarEvent(formData);
      }
      onClose();
    }
  };

  const handleDelete = () => {
    if (event) {
      deleteCalendarEvent(event.id);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tag') {
      const selectedTag = tagColors.find(t => t.name === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        color: selectedTag?.color || 'bg-blue-500'
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {event ? 'Termin bearbeiten' : 'Neuen Termin hinzufügen'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titel des Termins <span className="text-red-500">*</span>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Uhrzeit
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Etikett
            </label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            >
              {tagColors.map(tag => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-4">
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Löschen
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
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
                {event ? 'Aktualisieren' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarTemplate;
