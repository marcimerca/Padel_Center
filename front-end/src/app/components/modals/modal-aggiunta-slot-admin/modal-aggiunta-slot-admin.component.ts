import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-aggiunta-slot-admin',
  templateUrl: './modal-aggiunta-slot-admin.component.html',
  styleUrls: ['./modal-aggiunta-slot-admin.component.scss'],
})
export class ModalAggiuntaSlotAdminComponent {
  @Input() messaggio: string = '';
  constructor(public modalRef: MdbModalRef<ModalAggiuntaSlotAdminComponent>) {}
  @Output() onClose = new EventEmitter<string>();

  creaSlot(form: NgForm) {
    if (form.valid) {
      console.log('Form valido, inizio slot:', form.value.inizio);
      this.onClose.emit(form.value.inizio);
      this.modalRef.close(form.value.inizio);
    } else {
      console.log('Form non valido');
    }
  }

  annulla() {
    this.modalRef.close('annulla');
  }
}
