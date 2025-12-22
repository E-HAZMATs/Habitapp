import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';
import { APP_ROUTES } from '../constants/app-routes';

export const alreadyAuthenticatedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const token = tokenService.getToken();
  if (!token) return true
  else{
    router.navigateByUrl(APP_ROUTES.DASHBOARD);
    return false;
  }
};
