import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Partita } from '../models/partita.interface';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getPartitePerGiorno() {
    let dataAttuale = new Date();
    let dataFormattata = dataAttuale.toISOString().split('T')[0];

    return this.http.get<Partita[]>(
      `${this.apiURL}partite/per-data?data=${dataFormattata}`
    );
  }
}
