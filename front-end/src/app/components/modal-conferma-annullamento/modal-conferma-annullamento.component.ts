import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-modal-conferma-annullamento',
  templateUrl: './modal-conferma-annullamento.component.html',
  styleUrls: ['./modal-conferma-annullamento.component.scss'],
})
export class ModalConfermaAnnullamentoComponent {
  constructor(
    public modalRef: MdbModalRef<ModalConfermaAnnullamentoComponent>
  ) {}
}
