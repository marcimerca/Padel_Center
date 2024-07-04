import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor() {}

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
