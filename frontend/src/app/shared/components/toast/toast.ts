import { Component, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

interface ToastItem {
  message: string;
  type: 'success' | 'error';
  duration: number;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class Toast {
  visible = signal(false);
  message = '';
  type: 'success' | 'error' = 'success';

  private toastQueue: ToastItem[] = [];
  private isShowing = false;

  constructor(private toastService: ToastService) {
    this.toastService.toastState$.subscribe(data => {
      this.toastQueue.push({
        message: data.message,
        type: data.type,
        duration: data.duration || 3000,
      });
      this.showNext();
    });
  }

  private showNext() {
    if (this.isShowing || this.toastQueue.length === 0) return;

    const nextToast = this.toastQueue.shift()!;
    this.message = nextToast.message;
    this.type = nextToast.type;
    this.isShowing = true;
    this.visible.set(true);

    setTimeout(() => {
      this.visible.set(false);
      this.isShowing = false;
      this.showNext();
    }, nextToast.duration);
  }
}
