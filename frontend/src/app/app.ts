import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/auth/components/login/login";
import { TranslateModule } from '@ngx-translate/core';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";
import { LocalizationService } from './core/services/localization-service';
import { AuthService } from './core/services/auth-service';
import { Toast } from './shared/components/toast/toast';
import { ToastService } from './core/services/toast-service';

@Component({
  selector: 'app-root',
  imports: [TranslateModule, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit{
  private localizationService = inject(LocalizationService)
  private authService = inject(AuthService)
  private toastService = inject(ToastService)
  constructor(){
  }
  ngOnInit() {
    // this.toastService.show('Logged in successfully', 'success');
    // this.toastService.show('Invalid password', 'error', 5000);
    //   this.authService.login({
    //   email: "mail@gmail.com",
    //   password: 'password'
    // })
    this.authService.logout()
  }
}
