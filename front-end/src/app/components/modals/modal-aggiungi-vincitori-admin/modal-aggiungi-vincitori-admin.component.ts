import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-modal-aggiungi-vincitori-admin',
  templateUrl: './modal-aggiungi-vincitori-admin.component.html',
  styleUrls: ['./modal-aggiungi-vincitori-admin.component.scss'],
})
export class ModalAggiungiVincitoriAdminComponent {
  @Input() utentiInput: User[] = [];
  utenteSelezionato: User | null = null;
  utenteSelezionato2: User | null = null;
  utentiRimanenti: User[] = [];

  @Output() onClose: EventEmitter<{ tipo: string; compagni: User[] }> =
    new EventEmitter();
  constructor(
    public modalRef: MdbModalRef<ModalAggiungiVincitoriAdminComponent>
  ) {}

  confermaVittoria() {
    if (this.utenteSelezionato && this.utenteSelezionato2) {
      this.onClose.emit({
        tipo: 'vittoria',
        compagni: [this.utenteSelezionato, this.utenteSelezionato2],
      });
      this.modalRef.close({
        tipo: 'vittoria',
        compagni: [this.utenteSelezionato, this.utenteSelezionato2],
      });
    }
  }

  confermaSconfitta() {
    if (this.utenteSelezionato && this.utenteSelezionato2) {
      this.onClose.emit({
        tipo: 'sconfitta',
        compagni: [this.utenteSelezionato, this.utenteSelezionato2],
      });
      this.modalRef.close({
        tipo: 'sconfitta',
        compagni: [this.utenteSelezionato, this.utenteSelezionato2],
      });
    }
  }

  annulla() {
    this.modalRef.close();
  }
}
