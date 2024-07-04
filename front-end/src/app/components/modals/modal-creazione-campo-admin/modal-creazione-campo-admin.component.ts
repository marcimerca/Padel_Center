import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-creazione-campo-admin',
  templateUrl: './modal-creazione-campo-admin.component.html',
  styleUrls: ['./modal-creazione-campo-admin.component.scss'],
})
export class ModalCreazioneCampoAdminComponent {
  @Input() messaggio: string = '';
  constructor(
    public modalRef: MdbModalRef<ModalCreazioneCampoAdminComponent>
  ) {}
  @Output() onClose = new EventEmitter<string>();

  creaCampo(form: NgForm) {
    if (form.valid) {
      console.log('Form valido, nome Campo:', form.value.nomeCampo);
      this.onClose.emit(form.value.nomeCampo);
      this.modalRef.close(form.value.nomeCampo);
    } else {
      console.log('Form non valido');
    }
  }

  annulla() {
    this.modalRef.close('annulla');
  }
}
