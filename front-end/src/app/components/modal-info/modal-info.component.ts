import { Component, Input } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent {
  @Input() messaggio: string = '';
  constructor(public modalRef: MdbModalRef<ModalInfoComponent>) {}
}
