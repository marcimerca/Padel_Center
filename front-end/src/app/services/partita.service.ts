import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Partita } from '../models/partita.interface';
import { tap } from 'rxjs/operators';
import { Campo } from '../models/campo.interface';
import { PrenotazioneAdmin } from '../models/prenotazione-admin.interface';
import { Prenotazione } from '../models/prenotazione.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  getPartiteOggi() {
    let dataAttuale = new Date();
    let dataFormattata = dataAttuale.toISOString().split('T')[0];

    return this.http.get<Partita[]>(
      `${this.baseURL}partite/per-data?data=${dataFormattata}`
    );
  }

  getPartitePerData(data: string) {
    return this.http.get<Partita[]>(
      `${this.baseURL}partite/per-data?data=${data}`
    );
  }

  aggiungiAPartita(partita: Partial<Partita>) {
    return this.http.post(`${this.baseURL}partite`, partita, {
      responseType: 'text',
    });
  }

  findPartiteByLoggedUser(userId: number) {
    return this.http.get<Partita[]>(`${this.baseURL}partite/user`);
  }

  findPartiteByUserId(userId: number) {
    return this.http.get<Partita[]>(`${this.baseURL}partite/by-user/${userId}`);
  }

  annullaPrenotazione(partitaId: number) {
    return this.http.delete(`${this.baseURL}partite/${partitaId}`, {
      responseType: 'text',
    });
  }

  eliminaPartitaAdmin(partitaId: number) {
    return this.http.delete(`${this.baseURL}partite/delete/${partitaId}`, {
      responseType: 'text',
    });
  }

  savePrenotazioneAdmin(prenotazione: Partial<PrenotazioneAdmin>) {
    return this.http.post<PrenotazioneAdmin>(
      `${this.baseURL}prenotazione/admin`,
      prenotazione
    );
  }

  annullaPrenotazioneAdmin(id: number) {
    return this.http.delete(`${this.baseURL}prenotazioni/${id}`, {
      responseType: 'text',
    });
  }

  annullaPrenotazionePartitaAdmin(idPartita: number, userId: number) {
    return this.http.delete(
      `${this.baseURL}prenotazioni/${idPartita}/${userId}`,
      {
        responseType: 'text',
      }
    );
  }

  completaPartita(id: number) {
    return this.http.put(`${this.baseURL}partite/${id}/completa`, {});
  }

  findPrenotazioneBySlotAndData(slotId: number, dataPrenotazione: string) {
    return this.http.get<Prenotazione>(
      `${this.baseURL}prenotazioni/slot-data?slotId=${slotId}&dataPrenotazione=${dataPrenotazione}`
    );
  }

  getCampi() {
    return this.http.get<Campo[]>(`${this.baseURL}campi`);
  }

  aggiungiVincitori(partitaId: number, vincitori: User[]) {
    return this.http.put(
      `${this.baseURL}/partite/aggiungi-vincitori/${partitaId}`,
      vincitori
    );
  }

  aggiungiVincitoriAllaPartita2(
    partitaId: number,
    compagno: User | null,
    tipoRisultato: string
  ) {
    const url = `${this.baseURL}partite/aggiungi-vincitori2/${partitaId}?tipoRisultato=${tipoRisultato}`;
    return this.http.put<any>(url, compagno);
  }

  aggiungiVincitoriAllaPartitaAdmin(
    partitaId: number,
    compagni: User[] | null,
    tipoRisultato: string
  ) {
    const url = `${this.baseURL}partite/aggiungi-vincitori-admin/${partitaId}?tipoRisultato=${tipoRisultato}`;
    return this.http.put<any>(url, compagni);
  }
}
