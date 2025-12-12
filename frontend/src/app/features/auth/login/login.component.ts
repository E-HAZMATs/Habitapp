import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatFormField, MatLabel, MatInput],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {

}
