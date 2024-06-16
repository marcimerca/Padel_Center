import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-modal-conferma-prenotazione',
  templateUrl: './modal-conferma-prenotazione.component.html',
  styleUrls: ['./modal-conferma-prenotazione.component.scss'],
})
export class ModalConfermaPrenotazioneComponent {
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
