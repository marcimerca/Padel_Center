import { Component, Input } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-conferma',
  templateUrl: './modal-conferma.component.html',
  styleUrls: ['./modal-conferma.component.scss'],
})
export class ModalConfermaComponent {
  @Input() messaggio: string = '';

  constructor(public modalRef: MdbModalRef<ModalConfermaComponent>) {}

  conferma() {
    this.modalRef.close('conferma');
  }
  annulla() {
    this.modalRef.close();
  }
}
