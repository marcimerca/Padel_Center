import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalConfermaComponent } from '../modals/modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modals/modal-info/modal-info.component';

import { ModalPrenotazioneAdminComponent } from '../modals/modal-prenotazione-admin/modal-prenotazione-admin.component';
import { SlotDisponibilita } from 'src/app/models/slot-disponibilita.interface';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {}
