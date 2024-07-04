import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Campo } from '../models/campo.interface';
import { CampoDisponibilita } from '../models/campo-disponibilita.interface';
import { SlotOrarioDto } from '../models/slot-orario-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class CampoService {
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  getCampi() {
    return this.http.get<Campo[]>(`${this.baseURL}campi`);
  }

  getCampiConDisponibilita(data: string) {
    return this.http.get<CampoDisponibilita[]>(
      `${this.baseURL}campi/disponibilita/${data}`
    );
  }

  creaCampo(campo: Partial<Campo>) {
    return this.http.post<Campo>(`${this.baseURL}campi`, campo);
  }

  eliminaCampo(id: number) {
    return this.http.delete(`${this.baseURL}campi/${id}`, {
      responseType: 'text',
    });
  }

  aggiungiSlotOrario(slotOrarioDto: SlotOrarioDto) {
    return this.http.post(`${this.baseURL}slot-orari`, slotOrarioDto, {
      responseType: 'text',
    });
  }

  eliminaSlotOrario(id: number) {
    return this.http.delete(`${this.baseURL}slot-orari/${id}`, {
      responseType: 'text',
    });
  }

  eliminaTuttiSlotOrariCampo(id: number) {
    return this.http.delete(`${this.baseURL}slot-orari/campo/${id}`, {
      responseType: 'text',
    });
  }

  modificaNomeCampo(id: number, nomeCampo: Partial<Campo>) {
    return this.http.put(`${this.baseURL}campi/${id}`, nomeCampo);
  }
}
