import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-prenotazione-admin',
  templateUrl: './modal-prenotazione-admin.component.html',
  styleUrls: ['./modal-prenotazione-admin.component.scss'],
})
export class ModalPrenotazioneAdminComponent {
  @Input() messaggio: string = '';
  constructor(public modalRef: MdbModalRef<ModalPrenotazioneAdminComponent>) {}
  @Output() onClose = new EventEmitter<string>();

  prenotaAdmin(form: NgForm) {
    console.log('prenotaAdmin chiamato');
    if (form.valid) {
      console.log('Form valido, motivo:', form.value.motivoPrenotazione);
      this.onClose.emit(form.value.motivoPrenotazione);
      this.modalRef.close(form.value.motivoPrenotazione);
    } else {
      console.log('Form non valido');
    }
  }

  annulla() {
    this.modalRef.close('annulla');
  }
}
