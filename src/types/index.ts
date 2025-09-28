export interface Page {
  id: string;
  title: string;
  parentId: string | null;
  createdAt: Date;
  isExpanded?: boolean;
  icon?: string;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface Block {
  id: string;
  type: 'text' | 'heading' | 'todo' | 'image' | 'toggle' | 'divider' | 'code';
  content: string;
  checked?: boolean; // for todo type
  src?: string; // for image type
  language?: string; // for code type
  isExpanded?: boolean; // for toggle type
  children?: string[]; // for toggle type - array of child block IDs
  pageId: string;
  parentBlockId?: string; // for nested blocks
}

export interface BlockType {
  type: 'text' | 'heading' | 'todo' | 'image' | 'toggle' | 'divider' | 'code';
  label: string;
  icon: string;
  description: string;
}

// Template interfaces
export interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'roadmap' | 'calendar';
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  category: 'Planung' | 'Design' | 'Entwicklung';
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Nicht begonnen' | 'In Arbeit' | 'Abgeschlossen';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  tag: string;
  color: string;
}
