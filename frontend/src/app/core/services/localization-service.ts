import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'ar' | 'en';
@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private translate = inject(TranslateService)
  private readonly LANG_KEY = 'lang'
  currentLanguage = signal<Language>('en');
    constructor(){
    this.translate.addLangs(["ar", 'en']);
    this.translate.setFallbackLang( 'en');
    
    const savedLang: Language = this.getSavedLang();
    this.setLanguage(savedLang)
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  getSavedLang(): Language {
    const browserLang = this.translate.getBrowserLang()
    const defaultLanguage = browserLang ? (['ar', 'en'].includes(browserLang) ? browserLang : 'en') : 'en'
    return (localStorage.getItem(this.LANG_KEY) as Language) || defaultLanguage
  }
}
