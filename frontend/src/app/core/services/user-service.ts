import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService  {
    private _user = signal<user | null>(null);

    user = this._user.asReadonly();
    setUser(user: user){
      this._user.set(user);
    }

    clearUser(){
      this._user.set(null);
    }
}
