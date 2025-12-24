import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
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
  Validators,
} from '@angular/forms';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth-service';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-login',
  imports: [
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
    MatSuffix,
    MatIconButton,
    RouterLink,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  ROUTES = APP_ROUTES;
  protected hidePass: WritableSignal<boolean> = signal(true);
  protected authService = inject(AuthService);
  protected isLoading: WritableSignal<boolean> = signal(false);
  private validationErrorService = inject(ValidationErrorService);

  protected form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required /*Validators.minLength(6)*/], //TODO: Add min length validation later. But for now I allow 1 char passwords for quickness.
    }),
  });

  toggleHidePass(event: MouseEvent) {
    this.hidePass.set(!this.hidePass());
    // event.preventDefault();
  }

async submit() {
  if (this.form.invalid) return;
  
  this.isLoading.set(true);
  const { email, password } = this.form.getRawValue();
  // TODO: Handle exception returned from service login (wrong creds). Show toast is enough?
  try {
    await this.authService.login({ email, password });
  } finally {
    this.isLoading.set(false);
  }
}

  getValidationError(
    control: AbstractControl,
    fieldName: 'email' | 'password'
  ): string | null {
    return this.validationErrorService.getValidationError(control, fieldName);
  }
}
