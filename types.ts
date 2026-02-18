
export type TaskType = 'Work' | 'Personal' | 'Health' | 'Chaos';

export type PriorityRule = 'urgency' | 'importance' | 'energy';

export interface Task {
  id: string;
  title: string;
  date: string;     // ISO format YYYY-MM-DD
  startTime: number; // Hour in 24h format
  duration: number;  // Hours
  type: TaskType;
  urgency: number;    // 1-5
  importance: number; // 1-5
  energyLevel: number; // 1-5
  manaCost: number;   
  priority: number;   // Calculated weight
}

export interface PlayerStats {
  focus: number;
  agility: number;
  consistency: number;
  zen: number;
  mana: number;
  xp: number;
  level: number;
  shards: number; // New reward points currency
}
