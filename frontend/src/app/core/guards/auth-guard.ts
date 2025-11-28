import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';

// TODO: Add logic for when access token is expired?
export const authGuard: CanActivateFn = (route, state) => {
  const tokenSerive = inject(TokenService)
  const router = inject(Router)

  const token = tokenSerive.getToken()
  if(token) return true
  else{
    // router.navigate() //TODO: navigate to login page.    
    return false
  }
};
