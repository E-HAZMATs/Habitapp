import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { ENDPOINTS } from '../constants/api-endpoints';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService  {
    private _user = signal<user | null>(null);
    private api = inject(ApiService)
    user = this._user.asReadonly();

    getCurrentUser() {
      // todo setup controller for this.
      this.api.get(ENDPOINTS.user.me);
    }

    setUser(user: user){
      this._user.set(user);
    }

    clearUser(){
      this._user.set(null);
    }

    async getUser() {
      try{
        const user = await firstValueFrom(
          this.api.get<user>(ENDPOINTS.user.me)
        )
        this._user.set(user);
        console.log(user)
      } catch {
        console.error('error')
      }
    }
}
