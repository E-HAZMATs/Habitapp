import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { loginDto, loginResponseDto } from '../models/login.model';
import { TokenService } from './token-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService)
  private tokenService = inject(TokenService)

  login(loginDto: loginDto){
     this.api.post<loginResponseDto>('/user/login', loginDto)
    .subscribe({
      next: (value) => {
        this.tokenService.setToken(value.accessToken)
      },
      error: (err) => console.log(err), // TODO: implement a toast service for exceptions?
    })
  }

  //Todo implement navigtation. And error handling.
  register(registerDto: registerDto){
    this.api.post<registerResponseDto>('/user/register', registerDto)
    .subscribe({
      next: (value) => console.log(value),
      error: (err) => console.error(err)
    })
  }

  // Todo: implement logging out navigation.
  logout(){
    this.api.post('/user/logout', {})
    .subscribe({
      next: (val) => console.log(val),
      error: (err) => console.error(err)
    })
  }
}
