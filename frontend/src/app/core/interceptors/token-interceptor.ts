import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../services/api-service';
import { TokenService } from '../services/token-service';
import { catchError, shareReplay, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../constants/api-endpoints';

// This observeable is set when first 401 response.
// Used to prevent multiple refresh calls in case of concurrent 401 reqs.
let isAlreadyRefreshing$: Observable<any> | null = null;

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
        // Here, shareReplay(1) caches the response and returns it to all subs. So the req is only executed once.
        if (!isAlreadyRefreshing$) {
          isAlreadyRefreshing$ = api.get<{ token: string }>(ENDPOINTS.auth.refresh, {}).pipe(
            shareReplay(1),
          );
        }

        return isAlreadyRefreshing$.pipe(
          switchMap(res => {
            isAlreadyRefreshing$ = null;
            tokenService.setToken(res.token)
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.token}`)
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            isAlreadyRefreshing$ = null;
            tokenService.clearToken();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
