import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { TranslatePipe } from '@ngx-translate/core';
import { daysOfWeek } from '../../../core/constants/days-of-week';
import { HabitService } from '../../../core/services/habit-service';
import { frequencyType } from '../../../core/models/habit.model';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { HABIT_VALIDATION_CONSTS } from '../../../core/constants/habit-validation.constants';
@Component({
  selector: 'app-create-habit-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    TranslatePipe,
    MatRadioButton,
    MatRadioGroup,
    MatHint,
    MatError,
],
  templateUrl: './create-habit-modal.html',
  styleUrl: './create-habit-modal.css',
})
export class CreateHabitModal {
  protected daysOfWeek = daysOfWeek
  protected daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  protected HABIT_VALIDATION_CONSTS = HABIT_VALIDATION_CONSTS
  private habitService = inject(HabitService)
  private validationErrorService = inject(ValidationErrorService)
  protected form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(HABIT_VALIDATION_CONSTS.NAME_MAX_LENGTH)],
    }),
   description: new FormControl('', {
    validators: [Validators.maxLength(HABIT_VALIDATION_CONSTS.DESCRIPTION_MAX_LENGTH)]
   }),
   frequencyType: new FormControl<frequencyType>('daily', {
    nonNullable: true,
    validators: [Validators.required]
  }),
   frequencyAmount: new FormControl(1, {
    validators: [Validators.maxLength(HABIT_VALIDATION_CONSTS.FREQUENCY_AMOUNT_MAX),
       Validators.min(1), Validators.required],
    nonNullable: true
   }),
   timeOfDay: new FormControl(null, {}),
   dayOfWeek: new FormControl(null, {}),
   dayOfMonth: new FormControl(null, {
    validators: [Validators.max(HABIT_VALIDATION_CONSTS.DAY_OF_MONTH_MAX), Validators.min(1)]
   })
  });

  submit() {
    if (this.form.invalid) return;
    const values = this.form.getRawValue()
    this.habitService.create(values)
  }

  get currentFrequencyType() {
    return this.form.controls.frequencyType.value;
  }

  get currentFrequencyLocalizationKey() {
    const frequencyType = this.form.controls.frequencyType.value;
    const frequencyAmount = this.form.controls.frequencyAmount.value!;
    if (frequencyType == 'daily') return frequencyAmount > 1 ? "days" : "day";
    else if (frequencyType == 'weekly') return frequencyAmount > 1 ? "weeks" : "week";
    else return frequencyAmount > 1 ? "months" : "month";
  }

  getValidationError(
    control: AbstractControl,
    fieldName: any,
    number?: number | number[]
  ): string | null {
    return this.validationErrorService.getValidationError(control, fieldName, number !== undefined ? number : undefined);
  }
}
