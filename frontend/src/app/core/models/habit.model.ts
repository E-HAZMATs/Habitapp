// TODO: UPDATE TO PASCAL CASE FOR TYPES/INTERFACES
export type frequencyType = 'daily' | 'weekly' | 'monthly';

export interface habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequencyType: frequencyType;
  frequencyAmount: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay?: string;
  createdAt: string;
  updatedAt: string;
}

export interface createHabitDto {
  name: string;
  description: string | null;
  frequencyType: frequencyType;
  frequencyAmount: number;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  timeOfDay: string | null;
}

export interface updateHabitDto {
  name?: string;
  description?: string;
  frequencyType?: frequencyType;
  frequencyAmount?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay?: string;
}

export interface habitResponse {
  habit: habit;
}

export interface habitsListResponse {
  habits: habit[];
}