import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from "@angular/material/icon";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-login',
  imports: [MatCard, ReactiveFormsModule, MatCardContent, MatCardTitle, MatCardHeader, MatFormField, MatLabel, MatInput, TranslatePipe, MatIcon, MatAnchor, MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  protected hidePass: WritableSignal<boolean> = signal(true)
  
  protected form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required], //TODO: Add min length validation.
    }),
  })

  toggleHidePass(event: MouseEvent){
    this.hidePass.set(!this.hidePass())
    // event.preventDefault();
  }

  submit(){
    console.log(this.form)
    if(this.form.invalid) return; // CHECK: IS THIS FINE?

    const { email, password }= this.form.getRawValue();
    console.log(email)
    console.log(password)
  }
}
