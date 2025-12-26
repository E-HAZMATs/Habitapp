import { inject, Injectable } from '@angular/core';
import { env } from '../../../environments/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  private apiUrl = env.apiBaseUrl;
  private http = inject(HttpClient)

  get<T>(path: string, params?: any){
    return this.http.get<T>(this.apiUrl + path, {
      params,
      withCredentials: true
    },)
  }

  post<T>(path: string, body: any){
    return this.http.post<T>(this.apiUrl + path, body, {
      withCredentials: true
    });
  }

    put<T>(path: string, body: any) {
    return this.http.put<T>(this.apiUrl + path, body, {
      withCredentials: true
    });
  }

  patch<T>(path: string, body: any) {
    return this.http.patch<T>(this.apiUrl + path, body, {
      withCredentials: true
    })
  }

  delete<T>(path: string, id: string | number) {
    return this.http.delete<T>(this.apiUrl + path + `/${id}`, {
      withCredentials: true
    });
  }
}
