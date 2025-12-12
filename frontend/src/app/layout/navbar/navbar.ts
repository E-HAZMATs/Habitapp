import { Component, inject } from '@angular/core';
import { MatCardTitle } from "@angular/material/card";
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatButtonModule, MatMiniFabButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme-service';
import { LocalizationService } from '../../core/services/localization-service';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe, MatCardTitle, MatMenuModule, MatMiniFabButton, MatIconModule, TranslateModule, MatButtonModule, MatButton, RouterLink, RouterLinkActive, MatToolbarModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected themeService = inject(ThemeService)
  private localizationService = inject(LocalizationService)

  protected toggleTheme(){
    this.themeService.toggleTheme();
  }

  protected toggleLanguage(){
    this.localizationService.toggleLanguage()
  }
}
