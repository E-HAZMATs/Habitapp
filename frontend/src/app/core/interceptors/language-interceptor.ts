import { HttpInterceptorFn } from '@angular/common/http';
import { LocalizationService } from '../services/localization-service';
import { inject } from '@angular/core';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/assets/i18n/') || req.url.includes('/i18n/')) {
    return next(req);
  }
  const localizationService = inject(LocalizationService);
  const currentLanguage: string = localizationService.currentLanguage()
  const reqCopy = req.clone({
    headers: req.headers.set('accept-language', currentLanguage)
  })
  
  return next(reqCopy);
};
