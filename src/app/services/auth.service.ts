import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private UrlAuth = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.UrlAuth}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.UrlAuth}/login`, credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('userInfo', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError(error => throwError(error))
    );
  }
}