import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { ENDPOINTS } from '../constants/api-endpoints';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService  {
    private _user = signal<user | null>(null);
    private api = inject(ApiService)
    user = this._user.asReadonly();

    getCurrentUser() {
      this.api.get(ENDPOINTS.user.me);
    }

    setUser(user: user){
      this._user.set(user);
    }

    clearUser(){
      this._user.set(null);
    }

    async initUser() {
      try{
        const res = await firstValueFrom(
          this.api.get<ApiResponse<user>>(ENDPOINTS.user.me)
        )
        if (res.data) // CHECK: If stmt to silence ts warning cus apiresponse.data could be null. Handle this better?
          this._user.set(res.data);
        
      } catch {
        console.error('error')
      }
    }

    async 
}
