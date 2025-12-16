import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';
import { ApiService } from '../services/api-service';

// TODO: Add logic for when access token is expired?
export const authGuard: CanActivateFn = (route, state) => {
  const tokenSerive = inject(TokenService)
  const api = inject(ApiService)
  const router = inject(Router)

  const token = tokenSerive.getToken()
  if(token) return true
  
  // Refresh token (in case of refreshing page, token is gone from memory)
  // Not hitting the endpoint!
  api.post<{ accessToken: string }>('/auth/refresh', {}).subscribe({
    next: (res) => {
      console.log(res)
    },
    error: (err:any) => {
      console.log(err)
    }
  })
  router.navigate(['/login'])
  return false
  
};
