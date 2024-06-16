import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(public modalRef: MdbModalRef<ModalComponent>) {}

  conferma() {
    this.modalRef.close('conferma');
  }
  annulla() {
    this.modalRef.close();
  }
}
