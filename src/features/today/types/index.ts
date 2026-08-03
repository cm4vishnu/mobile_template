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