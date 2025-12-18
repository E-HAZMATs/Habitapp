import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { loginDto, loginResponseDto } from '../models/login.model';
import { TokenService } from './token-service';
import { ToastService } from './toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../models/api-response';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService)
  private tokenService = inject(TokenService)
  private toastService = inject(ToastService)
  private translateService = inject(TranslateService)
  private router = inject(Router)
  login(loginDto: loginDto){
     this.api.post<ApiResponse<loginResponseDto>>('/auth/login', loginDto)
    .subscribe({
      next: (value) => {
        this.tokenService.setToken(value.data!.token) // TODO: Implement handling if response.data doesn't exist?
        const msg = this.translateService.instant('loginSuccess')
        this.toastService.show(msg, 'success')
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.handleErrorToast(err)
    })
  }

  //Todo implement navigtation. And error handling.
  register(registerDto: registerDto){
    this.api.post<ApiResponse<registerResponseDto>>('/auth/register', registerDto)
    .subscribe({
      next: (value) => {
        const msg = this.translateService.instant('registerSuccess')
        this.toastService.show(msg, 'success')
      },
      error: (err) => this.handleErrorToast(err)
    })
  }

  logout(){
    this.api.post('/auth/logout', {})
    .subscribe({
      next: () => {
        this.tokenService.clearToken();
        const msg = this.translateService.instant('logoutSuccess')
        this.toastService.show(msg, "success")
        this.router.navigate(['/login'])
      },
      error: (err) => this.handleErrorToast(err)
    })
  }
  
  private handleErrorToast = (err: any) =>{
        const backendMsg = err.error?.message || this.translateService.instant('unexpectedServerError')
        this.toastService.show(backendMsg, 'error')
  }

  async restoreSession(): Promise<void> {
    try{
      const res = await firstValueFrom(
        this.api.get<{ token: string }>('/auth/refresh')
      );
      this.tokenService.setToken(res.token);
    }
    catch {
      
    }
  }
}
