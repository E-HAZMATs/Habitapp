import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastState = new Subject<{ message: string; type: 'success' | 'error'; duration?: number }>();
  private translateService = inject(TranslateService)
  toastState$ = this.toastState.asObservable();

  show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    this.toastState.next({ message, type, duration });
  }

  handleErrorToast = (err: any): void => {
    const backendMsg = 
      err.error?.message || 
      this.translateService.instant('unexpectedServerError');
    this.show(backendMsg, 'error');
  }
}
