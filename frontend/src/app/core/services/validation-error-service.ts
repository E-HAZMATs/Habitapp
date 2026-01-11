import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// TODO: Outsource this to shared?
type Field = 'email' | 'password' | 'confirmPassword' | 'username' | 'name'  // need better way?
export const VALIDATION_ERROR_KEYS = {
  // CHECK: If i have multiple email input fields, do I need to have different names for them?
  // so thye have a different scope here? or are will all email fields have the same validation?
  email: {
    required: "emailRequired",
    email: "emailInvalid"
  },
  password: {
    required: "passwordRequired",
  },
  confirmPassword: {
    required: "confirmPasswordRequired",
    passwordMismatch: "passwordMismatch"
  },
  username: {
    required: "usernameRequired", //TODO: Add min length for pass and this.
    whitespace: "noWhiteSpaceAllowed",
    maxlength: "userNameLengthValidation",
    minlength: "userNameLengthValidation"
  },
  name: {
    required: "nameRequired",
    maxlength: "maximumXChars"
  },
  description: {
    maxlength: "maximumXChars"
  },
  frequencyAmount: {
    required: "required",
    max: "inputBetweenXY",
    min: "inputBetweenXY"
  }
  // TODO: Add fallback/default validation messages?
} as const

@Injectable({
  providedIn: 'root',
})
export class ValidationErrorService {
  private translateSerive = inject(TranslateService)

  getValidationError(control: AbstractControl, field: Field, number?: number | number[]): string | null {
    if (!control || !control.touched || !control.errors) return null;
    const errorKey = Object.keys(control.errors)[0] as keyof typeof VALIDATION_ERROR_KEYS[Field];
    const messageKey = VALIDATION_ERROR_KEYS[field][errorKey];
    let params: Record<string, any> = {};
    if (Array.isArray(number)) {
      params = {};
      number.forEach((n, i) => {
        params[`number${i + 1}`] = n;
      });
    } else if (number !== undefined) {
      params = { number };
    }

    const message = messageKey ? this.translateSerive.instant(messageKey, params) : "THIS IS WRONG COME FIX IT!!" // TODO: Fallback needs default
    return message;
  }
}
