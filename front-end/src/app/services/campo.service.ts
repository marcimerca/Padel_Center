import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Campo } from '../models/campo.interface';
import { CampoDisponibilita } from '../models/campo-disponibilita.interface';

@Injectable({
  providedIn: 'root',
})
export class CampoService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getCampi() {
    return this.http.get<Campo[]>(`${this.apiURL}campi`);
  }

  getCampiConDisponibilita(data: string) {
    return this.http.get<CampoDisponibilita[]>(
      `${this.apiURL}campi/disponibilita/${data}`
    );
  }
}
