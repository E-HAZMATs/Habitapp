import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { TranslatePipe } from '@ngx-translate/core';
import { daysOfWeek } from '../../../core/constants/days-of-week';
import { HabitService } from '../../../core/services/habit-service';
import { frequencyType, habit } from '../../../core/models/habit.model';
import { ValidationErrorService } from '../../../core/services/validation-error-service';
import { HABIT_VALIDATION_CONSTS } from '../../../core/constants/habit-validation.constants';
import { MatTimepicker, MatTimepickerToggle, MatTimepickerInput } from '@angular/material/timepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { LocalizationService } from '../../../core/services/localization-service';
import { noWhitespaceNameValidator } from '../../../core/validators/field-validators';
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
    MatTimepicker,
    MatTimepickerToggle,
    MatSuffix,
    MatTimepickerInput,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-habit-modal.html',
  styleUrl: './create-habit-modal.css',
})
export class CreateHabitModal {
  protected daysOfWeek = daysOfWeek;
  protected daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  protected HABIT_VALIDATION_CONSTS = HABIT_VALIDATION_CONSTS;
  private habitService = inject(HabitService);
  private validationErrorService = inject(ValidationErrorService);
  private localizationService = inject(LocalizationService);
  private readonly _adapter =
    inject<DateAdapter<unknown, unknown>>(DateAdapter);

  protected editHabit: habit | null = inject(MAT_DIALOG_DATA, { optional: true });
  protected isEditMode = !!this.editHabit;

  protected form = new FormGroup({
    name: new FormControl(this.editHabit?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(HABIT_VALIDATION_CONSTS.NAME_MAX_LENGTH),
        noWhitespaceNameValidator,
      ],
    }),
    // CHECK: If a desc is entered and then deleted, it will be an empty string. Will this cause an issue?
    description: new FormControl(this.editHabit?.description ?? null, {
      validators: [
        Validators.maxLength(HABIT_VALIDATION_CONSTS.DESCRIPTION_MAX_LENGTH),
      ],
    }),
    frequencyType: new FormControl<frequencyType>(this.editHabit?.frequencyType ?? 'daily', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    frequencyAmount: new FormControl(this.editHabit?.frequencyAmount ?? 1, {
      validators: [
        Validators.maxLength(HABIT_VALIDATION_CONSTS.FREQUENCY_AMOUNT_MAX),
        Validators.min(1),
        Validators.required,
      ],
      nonNullable: true,
    }),
    timeOfDay: new FormControl<Date | null>(
      this.editHabit?.timeOfDay ? this.sqlTimeToDate(this.editHabit.timeOfDay) : null
    ),
    dayOfWeek: new FormControl<number | null>(this.editHabit?.dayOfWeek ?? null, {
      validators: [Validators.max(6), Validators.min(0)],
    }), // TODO: Make required? or make value (in case weekly is chosen) (already done) today's day of week (still not done)? Same for month?
    dayOfMonth: new FormControl<number | null>(this.editHabit?.dayOfMonth ?? null, {
      validators: [
        Validators.max(HABIT_VALIDATION_CONSTS.DAY_OF_MONTH_MAX),
        Validators.min(1),
      ],
    }),
  });

  constructor() {
    this.setTimePickerLocale();
    this.setupConditionalValidation();
  }

  async submit() {
    if (this.form.invalid) return;
    const values = this.form.getRawValue();

    if (this.isEditMode) {
      const payload = {
        ...values,
        description: values.description ?? undefined,
        timeOfDay: values.timeOfDay ? this.dateToSqlTime(values.timeOfDay) : undefined,
        dayOfWeek: values.dayOfWeek ?? undefined,
        dayOfMonth: values.dayOfMonth ?? undefined,
      };
      await this.habitService.update(this.editHabit!.id, payload);
    } else {
      const payload = {
        ...values,
        timeOfDay: values.timeOfDay ? this.dateToSqlTime(values.timeOfDay) : null,
      };
      this.habitService.create(payload);
    }
  }

  get currentFrequencyType() {
    return this.form.controls.frequencyType.value;
  }

  get currentDayOfMonth() {
    return this.form.controls.dayOfMonth.value;
  }

  get currentFrequencyLocalizationKey() {
    const frequencyType = this.form.controls.frequencyType.value;
    const frequencyAmount = this.form.controls.frequencyAmount.value!;
    if (frequencyType == 'daily') return frequencyAmount > 1 ? 'days' : 'day';
    else if (frequencyType == 'weekly')
      return frequencyAmount > 1 ? 'weeks' : 'week';
    else return frequencyAmount > 1 ? 'months' : 'month';
  }

  getValidationError(
    control: AbstractControl,
    fieldName: any,
    number?: number | number[]
  ): string | null {
    return this.validationErrorService.getValidationError(
      control,
      fieldName,
      number !== undefined ? number : undefined
    );
  }

  setTimePickerLocale() {
    const currentLang = this.localizationService.currentLanguage();
    const locale = currentLang === 'ar' ? 'ar-SA' : 'en-US';
    this._adapter.setLocale(locale);
  }

  dateToSqlTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');

    return `${h}:${m}:${s}`;
  }

  sqlTimeToDate(time: string): Date {
    const [hour, minute, second] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, second ?? 0, 0);
    return date;
  }

  private setupConditionalValidation() {
    const frequencyTypeControl = this.form.controls.frequencyType;
    const dayOfWeekControl = this.form.controls.dayOfWeek;
    const dayOfMonthControl = this.form.controls.dayOfMonth;

    const baseWeekValidators = dayOfWeekControl.validator
      ? [dayOfWeekControl.validator]
      : [];
    const baseMonthValidators = dayOfMonthControl.validator
      ? [dayOfMonthControl.validator]
      : [];

    frequencyTypeControl.valueChanges.subscribe((type) => {
      debugger;
      dayOfWeekControl.setValidators([
        ...baseWeekValidators,
        ...(type === 'weekly' ? [Validators.required] : []),
      ]);
      dayOfMonthControl.setValidators([
        ...baseMonthValidators,
        ...(type === 'monthly' ? [Validators.required] : []),
      ]);

      if (type !== 'weekly') dayOfWeekControl.setValue(null);
      if (type !== 'monthly') dayOfMonthControl.setValue(null);

      dayOfWeekControl.updateValueAndValidity();
      dayOfMonthControl.updateValueAndValidity();
    });
  }
}