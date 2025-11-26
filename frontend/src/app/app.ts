import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./features/auth/components/login/login";
import { TranslateModule } from '@ngx-translate/core';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  imports: [TranslateModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private translateService = inject(TranslateService)
  constructor(){
    this.translateService.addLangs(["ar", 'en']);
    this.translateService.setFallbackLang( 'en');

    const browserLang = this.translateService.getBrowserLang()
    this.translateService.use('en')
    console.log('brwoser' , browserLang)
  }

}
