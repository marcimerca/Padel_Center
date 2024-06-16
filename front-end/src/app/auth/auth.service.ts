import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { AuthData } from '../models/auth-data.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Register } from '../models/register.interface';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL;
  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: Register) {
    return this.http
      .post(`${this.apiURL}auth/register`, data, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          alert(error.error);
          return throwError(error);
        })
      );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.apiURL}auth/login`, data).pipe(
      tap(async (data) => {
        console.log('Auth data: ', data);
      }),
      tap((data) => {
        this.authSub.next(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
    );
  }

  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);
    this.authSub.next(user);
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(
      `${this.apiURL}users/check-email?email=${email}`
    );
  }

  // private errors(err: any) {
  //   console.log(err.error);
  //   switch (err.error) {
  //     case 'Email già presente nel sistema.':
  //       return throwError('The user already exists.');
  //       break;

  //     case 'Incorrect password':
  //       return throwError('Incorrect password');
  //       break;

  //     case 'Cannot find user':
  //       return throwError('User not found');
  //       break;

  //     default:
  //       return throwError('Request error');
  //       break;
  //   }
  // }
}
