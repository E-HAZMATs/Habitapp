import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatCardHeader,
} from '@angular/material/card';
import { UserService } from '../../../core/services/user-service';
import { user, UpdateProfileDto } from '../../../core/models/user.model';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordMatchValidator } from '../../../core/validators/field-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { ToastService } from '../../../core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    TranslatePipe,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatProgressSpinner,
    MatDivider,
    MatIcon
],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private userService = inject(UserService);
  private validationErrorService = inject(ValidationErrorService)
  protected user = this.userService.user as WritableSignal<user>;
  protected profileForm!: FormGroup
  protected saving = signal(false);
  protected passwordForm!: FormGroup;
  protected savingPassword = signal(false);
  protected showChangePassword = signal(false);

  protected timezones = [
    'Asia/Riyadh',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    "Asia/Shanghai"
  ];

  ngOnInit(): void {
    this.initForm();
    this.initPasswordForm();
  }

  private initPasswordForm() {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', { //These  names are the same as the controllers in the register form. Needs to be same name for validator.
        nonNullable: true,
        validators: [Validators.required, confirmPasswordMatchValidator],
      }),
    });
  }

  private initForm() {
    const user = this.user();
    if (!user) return;
    this.profileForm = new FormGroup(
    {
      username: new FormControl(
        user.username,
        {
          nonNullable: true,
          validators: [
            Validators.required, 
            Validators.minLength(4),
            Validators.maxLength(15),
            Validators.pattern(/^\S+$/)
          ],
        },
      ),

      email: new FormControl(user.email, {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),

      timezone: new FormControl(user.timezone, {
        nonNullable: true,
        validators: [Validators.required],
      }),

    },
  );
  }

    async onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    try {
      const updateData: UpdateProfileDto = {
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        timezone: this.profileForm.value.timezone,
      };
      await this.userService.updateCurrentUser(updateData);
    } catch (err) {
    } finally {
      this.saving.set(false);
    }
  }

  async onPasswordSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPassword.set(true);
    try {
      const { currentPassword, password, confirmPassword } = this.passwordForm.getRawValue();
      await this.userService.changePassword(currentPassword, password, confirmPassword);
      this.passwordForm.reset();
      this.passwordForm.markAsPristine();
    } catch {
    } finally {
      this.savingPassword.set(false);
    }
  }

    getValidationError(
    control: AbstractControl,
    fieldName: 'email' | 'password' | 'username'
  ): string | null {
    return this.validationErrorService.getValidationError(control, fieldName);
  }
}