import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-modal-annulla-prenotazione',
  templateUrl: './modal-annulla-prenotazione.component.html',
  styleUrls: ['./modal-annulla-prenotazione.component.scss'],
})
export class ModalAnnullaPrenotazioneComponent {
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}

  conferma() {
    this.modalRef.close('conferma');
  }
  annulla() {
    this.modalRef.close();
  }
}
