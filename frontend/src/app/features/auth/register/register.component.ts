import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth-service';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatFormField,
    MatLabel,
    MatInput,
    TranslatePipe,
    MatIcon,
    MatAnchor,
    MatError,
    MatIconButton,
    MatSuffix,
    MatButton,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class Register {
  protected hidePass: WritableSignal<boolean> = signal(true);
  protected hideConfirmPass: WritableSignal<boolean> = signal(true);
  protected authService = inject(AuthService);
  private validationErrorService = inject(ValidationErrorService);

  protected form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required /*Validators.minLength(6)*/],
    }),
    // TODOIMP: Add validation for confirm pass mismatch.
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  toggleHidePass(event: MouseEvent) {
    event.preventDefault();
    this.hidePass.set(!this.hidePass());
  }

  toggleHideConfirmPass(event: MouseEvent) {
    event.preventDefault();
    this.hideConfirmPass.set(!this.hideConfirmPass());
  }

  submit() {
    if (this.form.invalid) return;

    const { username, email, password } = this.form.getRawValue();
    this.authService.register({ username, email, password });
  }

  getValidationError(
    control: AbstractControl,
    fieldName: 'username' | 'email' | 'password' | 'confirmPassword'
  ): string | null {
    return this.validationErrorService.getValidationError(control, fieldName);
  }
}
