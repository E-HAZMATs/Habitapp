import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { ToastService } from './toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../models/api-response.model';
import { firstValueFrom } from 'rxjs';
import { 
  createHabitDto, 
  habit, 
  habitResponse,
  updateHabitDto,
} from '../models/habit.model';
import { HabitLogsResponse } from '../models/habit-log.model';
import { ENDPOINTS } from '../constants/api-endpoints';
@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private api = inject(ApiService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);

  async create(habitDto: createHabitDto): Promise<habit> {
    try {
      const response = await firstValueFrom(
        this.api.post<ApiResponse<habitResponse>>(ENDPOINTS.habit.create, habitDto)
      );
      
      const msg = response.message;
      this.toastService.show(msg, 'success');
      
      return response.data!.habit;
    } catch (err) {
      this.toastService.handleErrorToast(err);
      throw err;
    }
  }

  async getAllByUser(): Promise<habit[]> {
    try{
      const response = await firstValueFrom(
        this.api.get<ApiResponse<habit[]>>(ENDPOINTS.habit.getAllByUser)
      )
      const msg = response.message;
      this.toastService.show(msg, 'success');
      return response.data!;
    }
    // BIGTODO: Fix all the catches. i have to specify err as any to be able to reference err.error.message.
    catch (err) {
      this.toastService.handleErrorToast(err)
      throw err;
    }
  }

  async getById(id: string): Promise<habit> {
    try{
      const response = await firstValueFrom(
        this.api.get<ApiResponse<habit>>(ENDPOINTS.habit.getById + '/' + id)
      )
      this.toastService.show(response.message, 'success');
      return response.data!;
    }
    catch (err) {
      this.toastService.handleErrorToast(err);
      throw err;
    }
  }

  async update(habitId: string, habitDto: updateHabitDto): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.api.patch<ApiResponse<void>>(`${ENDPOINTS.habit.update}/${habitId}`, habitDto)
      );
      
      const msg = response.message;
      this.toastService.show(msg, 'success');
    } catch (err) {
      this.toastService.handleErrorToast(err);
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
      this.toastService.handleErrorToast(err);
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
      this.toastService.handleErrorToast(err);
      throw err;
    }
  }

  async habitComplete(habitId: string, completedAt : string): Promise<any> {
  try {
    const response = await firstValueFrom(
      this.api.post<ApiResponse<any>>(`${ENDPOINTS.habit.habitComplete}/${habitId}`, {completedAt})
    );
    
    const msg = response.message;
    this.toastService.show(msg, 'success');
    
    return response.data!;
  } catch (err) {
    this.toastService.handleErrorToast(err);
    throw err;
  }
}

}