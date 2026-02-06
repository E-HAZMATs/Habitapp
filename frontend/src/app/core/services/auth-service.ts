import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { loginDto, loginResponseDto } from '../models/login.model';
import { TokenService } from './token-service';
import { ToastService } from './toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes';
import { ENDPOINTS } from '../constants/api-endpoints';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ROUTES = APP_ROUTES;
  private api = inject(ApiService)
  private tokenService = inject(TokenService)
  private toastService = inject(ToastService)
  private translateService = inject(TranslateService)
  private userService = inject(UserService)
  private router = inject(Router)

async login(loginDto: loginDto) {
  try {
    const value = await firstValueFrom(
      this.api.post<ApiResponse<loginResponseDto>>(ENDPOINTS.auth.login, loginDto)
    );
    
    this.tokenService.setToken(value.data!.token);
    const msg = this.translateService.instant('loginSuccess');
    this.toastService.show(msg, 'success');
    this.router.navigateByUrl(this.ROUTES.DASHBOARD)
  } catch (err) {
    this.handleErrorToast(err);
    throw err;
  }
}
  //Todo implement navigtation. And error handling.
  async register(registerDto: registerDto){

    try{
      const value = await firstValueFrom(
        this.api.post<ApiResponse<registerResponseDto>>(ENDPOINTS.auth.register, registerDto)
      )
      const msg = this.translateService.instant('registerSuccess')
      this.toastService.show(msg, 'success')
      this.router.navigateByUrl(ENDPOINTS.auth.login)
    } catch (err) {
      this.handleErrorToast(err)
      throw err
    }
  }

  logout(){
    this.api.post(ENDPOINTS.auth.logout, {})
    .subscribe({
      next: () => {
        this.tokenService.clearToken();
        const msg = this.translateService.instant('logoutSuccess')
        this.toastService.show(msg, "success")
        this.router.navigate(['/auth', 'login'])
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
        this.api.get<ApiResponse<{ token: string }>>('/auth/refresh')
      );
      this.tokenService.setToken(res.data!.token);
      await this.userService.getUser();
    }
    catch {
      
    }
  }
}
