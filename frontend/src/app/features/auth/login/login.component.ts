import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from "@angular/material/icon";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { AuthService } from '../../../core/services/auth-service';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { RouterLink } from '@angular/router';

// TODO?: Should there be a guard for login page to redirect to dashboard for authed users?
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardContent, MatCardTitle, MatCardHeader, MatFormField, MatLabel, MatInput, TranslatePipe, MatIcon, MatAnchor, MatError, MatSuffix, MatIconButton, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  protected hidePass: WritableSignal<boolean> = signal(true)
  protected authService = inject(AuthService)
  private validationErrorService = inject(ValidationErrorService)
  
  protected form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, /*Validators.minLength(6)*/], //TODO: Add min length validation later. But for now I allow 1 char passwords for quickness.
    }),
  })

  toggleHidePass(event: MouseEvent){
    this.hidePass.set(!this.hidePass())
    // event.preventDefault();
  }

  submit(){
    if(this.form.invalid) return; // CHECK: IS THIS FINE?

    const { email, password }= this.form.getRawValue();
    this.authService.login({email, password})
  }

  getValidationError(control: AbstractControl, fieldName: 'email' | 'password'): string | null {
    return this.validationErrorService.getValidationError(control, fieldName);
  }
}
