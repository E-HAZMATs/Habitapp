import { Component, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class Toast {
  visible = signal(false);
  message = '';
  type: 'success' | 'error' = 'success';

  constructor(private toastService: ToastService) {
    // TODO: what if 2 toast data are emitting at the same time?
    // maybe schedule toasts?
    this.toastService.toastState$.subscribe(data => {
      this.message = data.message;
      this.type = data.type;
      this.visible.set(true);

      setTimeout(() => {
        this.visible.set(false)}, data.duration || 3000);
    });
  }
}
