import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Partita } from '../models/partita.interface';
import { tap } from 'rxjs/operators';
import { Campo } from '../models/campo.interface';
import { PrenotazioneAdmin } from '../models/prenotazione-admin.interface';
import { Prenotazione } from '../models/prenotazione.interface';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getPartiteOggi() {
    let dataAttuale = new Date();
    let dataFormattata = dataAttuale.toISOString().split('T')[0];

    return this.http.get<Partita[]>(
      `${this.apiURL}partite/per-data?data=${dataFormattata}`
    );
  }

  getPartitePerData(data: string) {
    return this.http.get<Partita[]>(
      `${this.apiURL}partite/per-data?data=${data}`
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

  savePrenotazioneAdmin(prenotazione: Partial<PrenotazioneAdmin>) {
    return this.http.post<PrenotazioneAdmin>(
      `${this.apiURL}prenotazione/admin`,
      prenotazione
    );
  }

  annullaPrenotazioneAdmin(id: number) {
    return this.http.delete(`${this.apiURL}prenotazioni/${id}`, {
      responseType: 'text',
    });
  }
  findPrenotazioneBySlotAndData(slotId: number, dataPrenotazione: string) {
    return this.http.get<Prenotazione>(
      `${this.apiURL}prenotazioni/slot-data?slotId=${slotId}&dataPrenotazione=${dataPrenotazione}`
    );
  }

  getCampi() {
    return this.http.get<Campo[]>(`${this.apiURL}campi`);
  }
}
