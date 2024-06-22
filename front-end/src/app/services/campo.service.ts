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

  // setSlotOccupato(
  //   slotId: number,
  //   dataOccupato: string,
  //   motivoOccupato: string
  // ) {
  //   const url = `${this.apiURL}slot-orari/${slotId}/occupato`;
  //   const body = {
  //     dataOccupato: dataOccupato,
  //     motivoOccupato: motivoOccupato,
  //   };

  //   return this.http.post<string>(url, body, {
  //     responseType: 'text' as 'json', // Forza il tipo 'json' in modo da evitare errori di tipo
  //   });
  // }
  // setSlotOccupato(
  //   slotId: number,
  //   dataOccupato: string,
  //   motivoOccupato: string
  // ) {
  //   const url = `${this.apiURL}slot-orari/${slotId}/occupato`;
  //   const body = {
  //     dataOccupato: dataOccupato,
  //     motivoOccupato: motivoOccupato,
  //   };

  //   return this.http.post<string>(url, body);
  // }
}
