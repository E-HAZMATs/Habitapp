import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-auth-layout.component',
  imports: [MatCard, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
