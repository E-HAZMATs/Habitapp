import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatCardHeader,
} from '@angular/material/card';
import { UserService } from '../../../core/services/user-service';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordMatchValidator } from '../../../core/validators/field-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { ToastService } from '../../../core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';

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
    MatButton
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private translateService = inject(TranslateService);
  protected user = this.userService.user as WritableSignal<user>;
  protected profileForm!: FormGroup
  protected saving = signal(false);

  protected timezones = [
    'Asia/Riyadh',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  ngOnInit(): void {
    this.initForm()    
  }

  private initForm() {
    this.profileForm = new FormGroup(
    {
      username: new FormControl(
        { value: this.user().username, disabled: true }, //TODO: Enable. Handle used usernames.
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        },
      ),

      email: new FormControl(this.user().email, {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),

      timezone: new FormControl(this.user().timezone, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      // currentPassword: new FormControl('', {
      //   nonNullable: true,
      // }),

      // newPassword: new FormControl('', {
      //   nonNullable: true,
      //   validators: [Validators.minLength(8)],
      // }),

      // confirmPassword: new FormControl('', {
      //   nonNullable: true,
      // }),
    },
    // {
    //   validators: confirmPasswordMatchValidator,
    // },
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
        email: this.profileForm.value.email,
        timezone: this.profileForm.value.timezone,
      };

      await this.userService.updateCurrentUser(updateData);
      const msg = this.translateService.instant('operationSuccess');
      this.toastService.show(msg, 'success');
    } catch (err) {
      this.toastService.handleErrorToast(err);
    } finally {
      this.saving.set(false);
    }
  }
}