import { BodyPartKey } from './bodyParts';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUri: string | null;
  gender: 'male' | 'female';
  dateOfBirth: string | null;
  heightCm: number | null;
  unitSystem: 'metric' | 'imperial';
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: number;
  userId: number;
  bodyPart: BodyPartKey;
  targetValue: number;
  createdAt: string;
}

export interface Measurement {
  id: number;
  userId: number;
  bodyPart: BodyPartKey;
  value: number;
  measuredAt: string;
  notes: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: number;
  userId: number;
  title: string;
  description: string;
  eventType: 'coaching' | 'check_in' | 'workout' | 'custom';
  startTime: string;
  endTime: string | null;
  location: string;
  reminderMins: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
