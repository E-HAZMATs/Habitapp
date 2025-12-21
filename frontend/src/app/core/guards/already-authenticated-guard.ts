import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';

export const alreadyAuthenticatedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const token = tokenService.getToken();
  if (!token) return true
  else{
    router.navigate(['/dashborad'])
    return false;
  }
};
