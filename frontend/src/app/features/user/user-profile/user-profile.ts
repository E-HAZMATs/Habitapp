import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle, MatCardHeader } from "@angular/material/card";
import { UserService } from '../../../core/services/user-service';
import { MatFormField, MatLabel } from "@angular/material/form-field";

@Component({
  selector: 'app-user-profile',
  imports: [MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatFormField, MatLabel],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit{
  private userService = inject(UserService);
  protected user = this.userService.user;
  ngOnInit(): void {
    console.log(this.user())
    console.log(typeof(this.user))
    throw new Error('Method not implemented.');
  }
}
