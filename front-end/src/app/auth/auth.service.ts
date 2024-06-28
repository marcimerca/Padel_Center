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
  baseURL = environment.baseURL;
  public authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: Register) {
    return this.http
      .post(`${this.baseURL}auth/register`, data, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          alert(error.error);
          return throwError(error);
        })
      );
  }

  registerConFoto(formData: FormData) {
    return this.http.post(`${this.baseURL}auth/register`, formData, {
      responseType: 'text',
    });
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.baseURL}auth/login`, data).pipe(
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

  updateUser(data: FormData) {
    return this.http.put<AuthData>(`${this.baseURL}users/update`, data).pipe(
      tap((updatedUser) => {
        this.authSub.next(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(
      `${this.baseURL}users/check-email?email=${email}`
    );
  }

  checkUsernameExists(username: string) {
    return this.http.get<boolean>(
      `${this.baseURL}users/check-username?username=${username}`
    );
  }

  caricaFotoUtente(foto: File) {
    return this.http.patch(`${this.baseURL}users/carica-foto`, foto);
  }
}
