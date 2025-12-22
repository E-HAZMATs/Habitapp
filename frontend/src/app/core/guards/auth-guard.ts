import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';
import { APP_ROUTES } from '../constants/app-routes';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenSerive = inject(TokenService)
  const router = inject(Router)

  const token = tokenSerive.getToken()
  
  if(token) return true
  else{
    router.navigateByUrl(APP_ROUTES.LOGIN)
    return false
  }
};
