import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthData } from '../models/auth-data.interface';

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

  private datiModal: { tipo: string; compagno?: User } | null = null;

  setDatiModal(data: { tipo: string; compagno?: User }) {
    this.datiModal = data;
  }

  getDatiModal(): { tipo: string; compagno?: User } | null {
    return this.datiModal;
  }

  private datiModalAdmin: { tipo: string; compagni?: User[] } | null = null;

  setDatiModalAdmin(data: { tipo: string; compagni?: User[] }) {
    this.datiModalAdmin = data;
  }

  getDatiModalAdmin(): { tipo: string; compagni?: User[] } | null {
    return this.datiModalAdmin;
  }
}
