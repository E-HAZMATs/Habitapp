import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatCardHeader,
} from '@angular/material/card';
import { UserService } from '../../../core/services/user-service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordMatchValidator } from '../../../core/validators/field-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from '@angular/material/select';

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
    TranslatePipe,
    MatInput,
    MatSelect,
    MatOption
],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private userService = inject(UserService);
  protected user = this.userService.user as WritableSignal<user>;
  protected profileForm!: FormGroup



  ngOnInit(): void {
    this.initForm()    
  }

  private initForm() {
    this.profileForm = new FormGroup(
    {
      username: new FormControl(
        { value: this.user().username, disabled: true },
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

      currentPassword: new FormControl('', {
        nonNullable: true,
      }),

      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.minLength(8)],
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
      }),
    },
    {
      validators: confirmPasswordMatchValidator,
    },
  );
  }
}
