import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-creazione-partita',
  templateUrl: './modal-creazione-partita.component.html',
  styleUrls: ['./modal-creazione-partita.component.scss'],
})
export class ModalCreazionePartitaComponent {
  constructor(public modalRef: MdbModalRef<ModalCreazionePartitaComponent>) {}

  conferma() {
    this.modalRef.close('conferma');
  }
  annulla() {
    this.modalRef.close();
  }
}
