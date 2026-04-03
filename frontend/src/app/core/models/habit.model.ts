export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequencyType: FrequencyType;
  frequencyAmount: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay?: string;
  createdAt: string;
  updatedAt: string;
  lastCompleted?: string;
  nextDueDate: string;
  dueIn?: any
}

export interface CreateHabitDto {
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyAmount: number;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  timeOfDay: string | null;
}

export interface UpdateHabitDto {
  name?: string;
  description?: string;
  frequencyType?: FrequencyType;
  frequencyAmount?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay?: string;
}

export interface HabitResponse {
  habit: Habit;
}

export interface HabitsListResponse {
  habits: Habit[];
}