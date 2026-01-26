import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../services/api-service';
import { TokenService } from '../services/token-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/api-endpoints';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/refresh')) return next(req);
  const api = inject(ApiService);
  const tokenService = inject(TokenService)
  const token = tokenService.getToken();
  const reqCopy = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(reqCopy).pipe(
    catchError(err => {
      if (err.status === 401 && !req.url.includes(ENDPOINTS.auth.login)) {
        return api.get<{ accessToken: string }>(ENDPOINTS.auth.refresh, {}).pipe(
          switchMap(res => {
            tokenService.setToken(res.accessToken)
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            tokenService.clearToken();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
