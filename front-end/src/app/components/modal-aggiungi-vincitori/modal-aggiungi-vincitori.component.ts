import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-modal-aggiungi-vincitori',
  templateUrl: './modal-aggiungi-vincitori.component.html',
  styleUrls: ['./modal-aggiungi-vincitori.component.scss'],
})
export class ModalAggiungiVincitoriComponent {
  @Input() utentiInput: User[] = [];

  @Output() onClose: EventEmitter<{ tipo: string; compagno?: User }> =
    new EventEmitter();

  utenteSelezionato: User | null = null;

  constructor(public modalRef: MdbModalRef<ModalAggiungiVincitoriComponent>) {}

  confermaVittoria() {
    if (this.utenteSelezionato) {
      this.onClose.emit({ tipo: 'vittoria', compagno: this.utenteSelezionato });
      this.modalRef.close({
        tipo: 'vittoria',
        compagno: this.utenteSelezionato,
      });
    }
  }

  confermaSconfitta() {
    this.onClose.emit({ tipo: 'sconfitta' });
    this.modalRef.close({
      tipo: 'sconfitta',
      compagno: this.utenteSelezionato,
    });
  }

  annulla() {
    this.modalRef.close();
  }
}
