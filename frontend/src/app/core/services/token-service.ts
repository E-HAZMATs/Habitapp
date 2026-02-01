import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessToken: WritableSignal<string | null> = signal(null)
  isAuthed = computed(() => this.accessToken() !== null);

  setToken(token: string){
    this.accessToken.set(token)
  }

  getToken(): string | null {
    return this.accessToken()
  }

  clearToken() {
    this.accessToken.set(null);
  }
}
