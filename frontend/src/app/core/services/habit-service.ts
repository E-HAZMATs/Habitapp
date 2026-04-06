import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { ToastService } from './toast-service';
import { ApiResponse, ApiError } from '../models/api-response.model';
import { firstValueFrom } from 'rxjs';
import { 
  CreateHabitDto, 
  Habit, 
  HabitResponse,
  UpdateHabitDto,
} from '../models/habit.model';
import { HabitLogsResponse, HabitLogCreatedResponse, HabitStatsMap } from '../models/habit-log.model';
import { ENDPOINTS } from '../constants/api-endpoints';
@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private api = inject(ApiService);
  private toastService = inject(ToastService);

  async create(habitDto: CreateHabitDto): Promise<Habit> {
    try {
      const response = await firstValueFrom(
        this.api.post<ApiResponse<HabitResponse>>(ENDPOINTS.habit.create, habitDto)
      );
      
      const msg = response.message;
      this.toastService.show(msg, 'success');
      
      return response.data!.habit;
    } catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async getAllByUser(): Promise<Habit[]> {
    try{
      const response = await firstValueFrom(
        this.api.get<ApiResponse<Habit[]>>(ENDPOINTS.habit.getAllByUser)
      )
      return response.data!;
    }
    catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async getById(id: string): Promise<Habit> {
    try{
      const response = await firstValueFrom(
        this.api.get<ApiResponse<Habit>>(ENDPOINTS.habit.getById + '/' + id)
      )
      return response.data!;
    }
    catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async update(habitId: string, habitDto: UpdateHabitDto): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.api.patch<ApiResponse<void>>(`${ENDPOINTS.habit.update}/${habitId}`, habitDto)
      );
      
      const msg = response.message;
      this.toastService.show(msg, 'success');
    } catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async delete(habitId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.api.delete<ApiResponse<void>>(ENDPOINTS.habit.delete, habitId)
      );
      const msg = response.message;
      this.toastService.show(msg, 'success');
    } catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async getLogsByUser(page: number = 1, size: number = 10): Promise<HabitLogsResponse> {
    try {
      const response = await firstValueFrom(
        this.api.get<ApiResponse<HabitLogsResponse>>(ENDPOINTS.habitLog.getByUser, { page, size })
      );
      return response.data!;
    } catch (err) {
      this.toastService.handleErrorToast(err as ApiError);
      throw err;
    }
  }

  async habitComplete(habitId: string, completedAt : string): Promise<HabitLogCreatedResponse> {
  try {
    const response = await firstValueFrom(
      this.api.post<ApiResponse<HabitLogCreatedResponse>>(`${ENDPOINTS.habit.habitComplete}/${habitId}`, {completedAt})
    );
    
    const msg = response.message;
    this.toastService.show(msg, 'success');
    
    return response.data!;
  } catch (err) {
    this.toastService.handleErrorToast(err as ApiError);
    throw err;
  }
}

async markLogAsSkipped(logId: string): Promise<void> {
  try {
    const response = await firstValueFrom(
      this.api.patch<ApiResponse<void>>(`${ENDPOINTS.habitLog.markAsSkipped}/${logId}/skip`, {})
    );
    this.toastService.show(response.message, 'success');
  } catch (err) {
    this.toastService.handleErrorToast(err as ApiError);
    throw err;
  }
}

  async getStats(): Promise<HabitStatsMap> {
    try {
      const response = await firstValueFrom(
        this.api.get<ApiResponse<HabitStatsMap>>(ENDPOINTS.habitLog.stats)
      );
    return response.data!;
  } catch (err) {
    this.toastService.handleErrorToast(err as ApiError);
    throw err;
  }
}

}