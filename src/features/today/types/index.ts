export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export type SectionKey = 'morning' | 'work-block-1' | 'lunch' | 'work-block-2' | 'night';

export interface SectionConfig {
  key: SectionKey;
  title: string;
}

export const SECTIONS: SectionConfig[] = [
  { key: 'morning', title: 'Morning' },
  { key: 'work-block-1', title: 'Work Block 1' },
  { key: 'lunch', title: 'Lunch' },
  { key: 'work-block-2', title: 'Work Block 2' },
  { key: 'night', title: 'Night' },
];

/**
 * Represents a daily session for task management.
 */
export interface Session {
  id: number;
  date: string;
  slots: TaskSlot[];
}

/**
 * Represents a task slot within a session.
 */
export interface TaskSlot {
  id: number;
  slotType: string;
  orderIndex: number;
  tasks: Task[];
}