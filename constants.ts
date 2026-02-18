
import { Task } from './types';

const today = new Date().toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Morning Code Audit',
    date: today,
    startTime: 9,
    duration: 2,
    type: 'Work',
    urgency: 4,
    importance: 5,
    energyLevel: 4,
    manaCost: 40,
    priority: 4,
  },
  {
    id: '2',
    title: 'Solar Core Workout',
    date: today,
    startTime: 12,
    duration: 1,
    type: 'Health',
    urgency: 3,
    importance: 3,
    energyLevel: 5,
    manaCost: 20,
    priority: 3,
  },
  {
    id: '3',
    title: 'Nebula Protocol Lunch',
    date: today,
    startTime: 13.5,
    duration: 1,
    type: 'Personal',
    urgency: 2,
    importance: 2,
    energyLevel: 1,
    manaCost: -15,
    priority: 2,
  },
];

export const CHAOS_EVENTS = [
  { title: 'Server Warp Breach', type: 'Work' as const, duration: 1.5, urgency: 5, importance: 5, energyLevel: 5, manaCost: 60, priority: 5 },
  { title: 'Emergency AI Council', type: 'Work' as const, duration: 2, urgency: 4, importance: 5, energyLevel: 4, manaCost: 50, priority: 4 },
  { title: 'Unexpected Wormhole Call', type: 'Personal' as const, duration: 0.5, urgency: 4, importance: 2, energyLevel: 2, manaCost: 25, priority: 3 },
];
