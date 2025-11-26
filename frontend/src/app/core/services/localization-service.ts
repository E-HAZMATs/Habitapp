import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private translate = inject(TranslateService)
    constructor(){
    this.translate.addLangs(["ar", 'en']);
    this.translate.setFallbackLang( 'en');
    
    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang() ?? ''
    const usedLang: string = savedLang ?? (['en', 'ar'].includes(browserLang) ? browserLang : 'en');
    localStorage.setItem('lang', usedLang)
    this.translate.use(usedLang)
    this.updateHtmlDir(usedLang);

  }

  private updateHtmlDir(lang: string){
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
