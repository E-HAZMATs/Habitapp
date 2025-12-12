import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  imports: [MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatFormField, MatLabel, MatInput, TranslatePipe, MatIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  protected hidePass: WritableSignal<boolean> = signal(true)

  toggleHidePass(event: MouseEvent){
    this.hidePass.set(!this.hidePass())
    console.log(this.hidePass())
    // event.preventDefault();
  }
}
