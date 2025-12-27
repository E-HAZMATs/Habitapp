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
} from '../models/habit.model';

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
        this.api.post<ApiResponse<habitResponse>>('/habit/create', habitDto)
      );
      
      const msg = this.translateService.instant('habitCreatedSuccess');
      this.toastService.show(msg, 'success');
      
      return response.data!.habit;
    } catch (err) {
      this.handleErrorToast(err);
      throw err;
    }
  }

  private handleErrorToast = (err: any): void => {
    const backendMsg = 
      err.error?.message || 
      this.translateService.instant('unexpectedServerError');
    this.toastService.show(backendMsg, 'error');
  }
}