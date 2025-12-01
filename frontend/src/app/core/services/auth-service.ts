import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { loginDto, loginResponseDto } from '../models/login.model';
import { TokenService } from './token-service';
import { ToastService } from './toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService)
  private tokenService = inject(TokenService)
  private toastService = inject(ToastService)
  private translateService = inject(TranslateService)

  login(loginDto: loginDto){
     this.api.post<ApiResponse<loginResponseDto>>('/user/login', loginDto)
    .subscribe({
      next: (value) => {
        // TODO: Navigation after successful login
        this.tokenService.setToken(value.data!.token)
        const msg = this.translateService.instant('loginSuccess')
        this.toastService.show(msg, 'success')
      },
      error: (err) => this.toastService.show(err.error, 'error')
    })
  }

  //Todo implement navigtation. And error handling.
  register(registerDto: registerDto){
    this.api.post<ApiResponse<registerResponseDto>>('/user/register', registerDto)
    .subscribe({
      next: (value) => {
        const msg = this.translateService.instant('registerSuccess')
        this.toastService.show(msg, 'success')
      },
      error: (err) => console.error(err)
    })
  }

  // Todo: implement logging out navigation.
  logout(){
    this.api.post('/user/logout', {})
    .subscribe({
      next: () => {
        // TODO: I'm getting a silent error in the log, cus even if the request is successful
        // angular expects the response to json.
        const msg = this.translateService.instant('logoutSuccess')
        this.toastService.show(msg, "success")
      },
      error: (err) => console.error(err)
    })
  }
}
