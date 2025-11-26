import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/auth/components/login/login";
import { TranslateModule } from '@ngx-translate/core';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";
import { LocalizationService } from './core/services/localization-service';

@Component({
  selector: 'app-root',
  imports: [TranslateModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private localizationService = inject(LocalizationService)
}
