export type LogStatus = 'completed' | 'missed' | 'skipped';

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string;
  status: LogStatus;
  dueDate: string;
  nextDueDate: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  Habit: {
    name: string;
    description?: string;
    frequencyType: string;
  };
}

export interface HabitLogPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HabitLogsResponse {
  logs: HabitLog[];
  pagination: HabitLogPagination;
}
