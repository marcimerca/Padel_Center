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
  partiteDaGiocare: Partita[] = [];
  partitePassate: Partita[] = [];

  modalRef: MdbModalRef<ModalAnnullaPrenotazioneComponent> | null = null;
  modalRef2: MdbModalRef<ModalConfermaAnnullamentoComponent> | null = null;

  constructor(
    private authSrv: AuthService,
    private partitaSrv: PartitaService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.caricaPartite();
  }
  caricaPartite() {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;

      if (this.user && this.user.id) {
        this.partitaSrv
          .findPartiteByUserId(this.user.id)
          .subscribe((partite) => {
            const now = new Date();
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );

            this.partiteDaGiocare = partite
              .filter((partita) => {
                const partitaTime = new Date(
                  partita.dataPartita + 'T' + partita.slotOrario.inizio
                );
                return (
                  partitaTime > now ||
                  (partitaTime.getTime() === today.getTime() &&
                    (partitaTime.getHours() > now.getHours() ||
                      (partitaTime.getHours() === now.getHours() &&
                        partitaTime.getMinutes() > now.getMinutes())))
                );
              })
              .sort((a, b) => {
                const dateA = new Date(
                  a.dataPartita + 'T' + a.slotOrario.inizio
                );
                const dateB = new Date(
                  b.dataPartita + 'T' + b.slotOrario.inizio
                );
                return dateA.getTime() - dateB.getTime();
              });

            this.partitePassate = partite
              .filter((partita) => {
                const partitaTime = new Date(
                  partita.dataPartita + 'T' + partita.slotOrario.inizio
                );
                return (
                  partitaTime < now ||
                  (partitaTime.getTime() === today.getTime() &&
                    (partitaTime.getHours() < now.getHours() ||
                      (partitaTime.getHours() === now.getHours() &&
                        partitaTime.getMinutes() <= now.getMinutes())))
                );
              })
              .sort((a, b) => {
                const dateA = new Date(
                  a.dataPartita + 'T' + a.slotOrario.inizio
                );
                const dateB = new Date(
                  b.dataPartita + 'T' + b.slotOrario.inizio
                );
                return dateB.getTime() - dateA.getTime();
              });
          });
      }
    });
  }

  annullaPrenotazione(partitaId: number) {
    this.partitaSrv.annullaPrenotazione(partitaId).subscribe(() => {
      console.log('La prenotazione è stata annullata correttamente');
      this.caricaPartite();
      this.apriModale2();
    });
  }

  apriModale(partitaId: number) {
    this.modalRef = this.modalService.open(ModalAnnullaPrenotazioneComponent, {
      modalClass: 'modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.annullaPrenotazione(partitaId);
      }
    });
  }

  apriModale2() {
    this.modalRef2 = this.modalService.open(
      ModalConfermaAnnullamentoComponent,
      {
        modalClass: 'modal-dialog-centered',
      }
    );
  }

  verificaDataFutura(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    return date > new Date();
  }

  verificaDataOggi(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  verificaPiu24H(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    const now = new Date();

    const timeDiff = date.getTime() - now.getTime();

    return timeDiff > 24 * 60 * 60 * 1000;
  }
}
