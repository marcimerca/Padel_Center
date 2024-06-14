import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Partita } from '../models/partita.interface';
import { tap } from 'rxjs/operators';

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
      `${this.apiURL}partite/per-data?data=2024-06-13`
    );
  }

  aggiungiAPartita(partita: Partial<Partita>) {
    return this.http.post(`${this.apiURL}partite`, partita, {
      responseType: 'text',
    });
  }

  findPartiteByUserId(userId: number) {
    return this.http.get<Partita[]>(`${this.apiURL}partite/user`);
  }

  annullaPrenotazione(partitaId: number) {
    return this.http.delete(`${this.apiURL}partite/${partitaId}`, {
      responseType: 'text',
    });
  }
}
