import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { TranslatePipe } from '@ngx-translate/core';
import { daysOfWeek } from '../../../core/constants/days-of-week';

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
    MatHint
],
  templateUrl: './create-habit-modal.html',
  styleUrl: './create-habit-modal.css',
})
export class CreateHabitModal {
  protected daysOfWeek = daysOfWeek
  protected form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
   description: new FormControl('', {
   }),
   frequencyType: new FormControl('daily', {
   }),
   frequencyAmount: new FormControl(1, {}),
   timeOfDay: new FormControl(0, {})
  });

  submit() {}

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
}
