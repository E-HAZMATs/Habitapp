import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return /\s/.test(control.value) ? { whitespace: true } : null;
}

export function noWhitespaceNameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  return value.trim().length === 0 ? { whitespace: true } : null;
}

export function confirmPasswordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.parent) return null;

  const password = control.parent.get('password')?.value;
  const confirmPassword = control.value;

  if (!confirmPassword) return null;

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
}