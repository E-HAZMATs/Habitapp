import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastState = new Subject<{ message: string; type: 'success' | 'error'; duration?: number }>();
  toastState$ = this.toastState.asObservable();

  show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    this.toastState.next({ message, type, duration });
  }
}
