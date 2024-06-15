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
  ngOnInit(): void {
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
  isPastDate(dateString: string): boolean {
    return new Date(dateString) <= new Date();
  }
  isFutureDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date > new Date();
  }

  isToday(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();

    // Verifica se la data è oggi
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (!isToday) {
      return false;
    }

    // Verifica se l'orario della partita è nel futuro rispetto all'ora attuale
    const hoursDiff = date.getHours() - now.getHours();
    const minutesDiff = date.getMinutes() - now.getMinutes();

    // Considera solo le partite che sono entro 24 ore in futuro
    if (
      hoursDiff < 24 &&
      (hoursDiff > 0 || (hoursDiff === 0 && minutesDiff > 0))
    ) {
      return true;
    }

    return false;
  }

  isFutureDateMoreThan24Hours(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();

    // Calcola la differenza in millisecondi tra le due date
    const timeDiff = date.getTime() - now.getTime();

    // Verifica se la data è nel futuro e più di 24 ore nel futuro
    return timeDiff > 0 && timeDiff > 24 * 60 * 60 * 1000;
  }
}
