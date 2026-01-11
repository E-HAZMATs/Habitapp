import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /\s/.test(control.value) ? { whitespace: true } : null;
}
