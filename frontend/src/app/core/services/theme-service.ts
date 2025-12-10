import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';
export type ThemeIconName = 'dark_mode' | 'light_mode'; 

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  currentTheme = signal<Theme>(this.getInitialTheme());
  themeIcon = computed<ThemeIconName>(() =>
    this.currentTheme() === 'light' ? 'dark_mode' : 'light_mode'
  );
  
  constructor() {
    effect(() => this.applyTheme(this.currentTheme()));
  }

  toggleTheme(): void {
    this.currentTheme.set(this.currentTheme() === 'light' ? 'dark' : 'light');
    localStorage.setItem(this.THEME_KEY, this.currentTheme());
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getInitialTheme(): Theme {
    return (localStorage.getItem(this.THEME_KEY) as Theme) || 'light';
  }
}