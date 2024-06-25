import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${this.baseURL}users`);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.baseURL}users/${id}`);
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${this.baseURL}users/${id}`);
  }
}
