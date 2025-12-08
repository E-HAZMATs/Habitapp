import { Component, inject, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { TranslatePipe } from '@ngx-translate/core';
import { MatAnchor, MatMiniFabButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme-service';
import { LocalizationService } from '../../core/services/localization-service';

@Component({
  selector: 'app-navbar',
  imports: [MatCard, MatCardContent, TranslatePipe, MatCardTitle, MatAnchor, MatMiniFabButton, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private themeService = inject(ThemeService)
  private localizationService = inject(LocalizationService)
  protected themeBtnIcon = signal(this.getThemeBtnLogo())

  protected toggleTheme(){
    this.themeService.toggleTheme();
    this.themeBtnIcon.set(this.getThemeBtnLogo())
  }
  
  protected getThemeBtnLogo(){
    return this.themeService.currentTheme() === 'light' ? 'dark_mode' : 'light_mode'
  }

  protected toggleLanguage(){
    this.localizationService.toggleLanguage()
  }
}
