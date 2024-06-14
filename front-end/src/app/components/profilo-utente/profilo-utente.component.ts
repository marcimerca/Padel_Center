import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalAnnullaPrenotazioneComponent } from '../modal-annulla-prenotazione/modal-annulla-prenotazione.component';
import { ModalConfermaAnnullamentoComponent } from '../modal-conferma-annullamento/modal-conferma-annullamento.component';

@Component({
  selector: 'app-profilo-utente',
  templateUrl: './profilo-utente.component.html',
  styleUrls: ['./profilo-utente.component.scss'],
})
export class ProfiloUtenteComponent implements OnInit {
  user!: AuthData | null;
  partiteUser!: Partita[];

  modalRef: MdbModalRef<ModalAnnullaPrenotazioneComponent> | null = null;

  modalRef2: MdbModalRef<ModalConfermaAnnullamentoComponent> | null = null;

  constructor(
    private authSrv: AuthService,
    private partitaSrv: PartitaService,
    private modalService: MdbModalService
  ) {}

  ngOnInit() {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
      if (this.user && this.user.id) {
        this.partitaSrv
          .findPartiteByUserId(this.user.id)
          .subscribe((partite) => {
            this.partiteUser = partite
              .sort((a, b) => {
                const dateA = new Date(a.slotOrario.inizio);
                const dateB = new Date(b.slotOrario.inizio);
                return dateA.getTime() - dateB.getTime();
              })
              .reverse();
          });
      }
    });
  }

  annullaPrenotazione(partitaId: number) {
    this.partitaSrv.annullaPrenotazione(partitaId).subscribe(() => {
      console.log('La prenotazione è stata annullata correttamente');
      this.partitaSrv
        .findPartiteByUserId(this.user!.id)
        .subscribe((partite) => {
          this.partiteUser = partite
            .sort((a, b) => {
              const dateA = new Date(a.slotOrario.inizio);
              const dateB = new Date(b.slotOrario.inizio);
              return dateA.getTime() - dateB.getTime();
            })
            .reverse();

          this.openSecondModal();
        });
    });
  }

  openModal(partitaId: number) {
    this.modalRef = this.modalService.open(ModalAnnullaPrenotazioneComponent, {
      modalClass: 'modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.annullaPrenotazione(partitaId);
      }
    });
  }

  openSecondModal() {
    this.modalRef2 = this.modalService.open(
      ModalConfermaAnnullamentoComponent,
      {
        modalClass: 'modal-dialog-centered',
      }
    );
  }

  isFutureDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date > new Date();
  }

  isFutureDateMoreThan24Hours(dateStr: string): boolean {
    const date = new Date(dateStr);
    const timeDiffInHours = (date.getTime() - Date.now()) / (1000 * 3600);
    return date > new Date() && timeDiffInHours > 24;
  }
}
