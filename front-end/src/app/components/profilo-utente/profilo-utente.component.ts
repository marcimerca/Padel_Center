import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.interface';
import { ModalAggiungiVincitoriComponent } from '../modal-aggiungi-vincitori/modal-aggiungi-vincitori.component';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-profilo-utente',
  templateUrl: './profilo-utente.component.html',
  styleUrls: ['./profilo-utente.component.scss'],
})
export class ProfiloUtenteComponent implements OnInit, OnDestroy {
  userId: string = '';

  user!: AuthData | User | null;
  conteggioPartiteVinte: number = 0;
  conteggioPartitePerse: number = 0;
  partiteDaGiocare: Partita[] = [];
  partitePassate: Partita[] = [];
  partitaCompleta = true;

  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;
  modalRef3: MdbModalRef<ModalAggiungiVincitoriComponent> | null = null;

  datiModalSubscription: Subscription | null = null;

  constructor(
    private authSrv: AuthService,
    private partitaSrv: PartitaService,
    private modalSrv: MdbModalService,
    private route: ActivatedRoute,
    private userSrv: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.userSrv.getUserById(parseInt(id)).subscribe((userData) => {
          this.user = userData;
          this.caricaPartite(); // Passa l'oggetto user direttamente
        });
      } else {
        this.authSrv.user$.subscribe((user) => {
          this.user = user;
          if (this.user) {
            this.caricaPartite();
          }
        });
      }
    });
  }

  caricaPartite() {
    let caricaPartiteObservable;

    if ('accessToken' in this.user!) {
      caricaPartiteObservable = this.partitaSrv.findPartiteByLoggedUser(
        this.user.id
      );
    } else {
      caricaPartiteObservable = this.partitaSrv.findPartiteByUserId(
        this.user!.id
      );
    }
    caricaPartiteObservable.subscribe((partite) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      this.partiteDaGiocare = partite
        .filter((partita) => {
          const partitaTime = new Date(
            partita.dataPrenotazione + 'T' + partita.slotOrario.inizio
          );
          return (
            partitaTime > now ||
            (partitaTime.getTime() === today.getTime() &&
              (partitaTime.getHours() > now.getHours() ||
                (partitaTime.getHours() === now.getHours() &&
                  partitaTime.getMinutes() > now.getMinutes())))
          );
        })
        .sort(
          (a, b) =>
            new Date(a.dataPrenotazione + 'T' + a.slotOrario.inizio).getTime() -
            new Date(b.dataPrenotazione + 'T' + b.slotOrario.inizio).getTime()
        );

      this.partitePassate = partite
        .filter((partita) => {
          const partitaTime = new Date(
            partita.dataPrenotazione + 'T' + partita.slotOrario.inizio
          );
          return (
            partitaTime < now ||
            (partitaTime.getTime() === today.getTime() &&
              (partitaTime.getHours() < now.getHours() ||
                (partitaTime.getHours() === now.getHours() &&
                  partitaTime.getMinutes() <= now.getMinutes())))
          );
        })
        .sort(
          (a, b) =>
            new Date(b.dataPrenotazione + 'T' + b.slotOrario.inizio).getTime() -
            new Date(a.dataPrenotazione + 'T' + a.slotOrario.inizio).getTime()
        );
      this.calcolaConteggioPartiteVinteEPersa();
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
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Vuoi annullare la prenotazione?',
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.annullaPrenotazione(partitaId);
      }
    });
  }

  apriModale2() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio:
          'Hai annullato correttamente la tua prenotazione per la partita',
      },
    });
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

  verificaUtenteGiaAggiunto(partita: Partita): boolean {
    return partita.utentiPrenotati.some(
      (utente) => utente.id === this.user!.id
    );
  }

  apriModaleInfoCircolo() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Numero: 0444/198471',
      },
    });
  }

  formatattaData(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
  }

  eliminaPartita(partitaId: number) {
    this.partitaSrv.eliminaPartitaAdmin(partitaId).subscribe(() => {
      console.log('La prenotazione è stata annullata correttamente');
      this.caricaPartite();
      this.apriModaleConfermaEliminazionePartita();
    });
  }

  apriModaleEliminaPartita(partitaId: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Vuoi eliminare la partita?',
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.eliminaPartita(partitaId);
      }
    });
  }
  apriModaleConfermaEliminazionePartita() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Partita eliminata correttamente',
      },
    });
  }

  bloccaESbloccaPartecipazione(partita: Partita) {
    this.partitaSrv.completaPartita(partita.id!).subscribe(() => {
      if (partita.numGiocatoriAttuali === partita.numMaxGiocatori) {
        partita.numGiocatoriAttuali = partita.utentiPrenotati.length;
      } else {
        partita.numGiocatoriAttuali = partita.numMaxGiocatori;
      }
    });
  }
  apriModaleConfermaRisultato(partitaId: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Confermi il risultato: ?',
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.annullaPrenotazione(partitaId);
      }
    });
  }
  apriModaleRisultato(partita: Partita) {
    this.modalRef3 = this.modalSrv.open(ModalAggiungiVincitoriComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        utentiInput: partita.utentiPrenotati.filter(
          (utente) => utente.id !== this.user?.id
        ),
      },
    });

    this.modalRef3.onClose.subscribe((result) => {
      if (result.tipo === 'vittoria') {
        console.log('Vittoria registrata', result.compagno);
        this.partitaSrv
          .aggiungiVincitoriAllaPartita2(
            partita.id!,
            result.compagno,
            result.tipo
          )
          .subscribe(
            (response) => {
              console.log('Vincitori aggiunti con successo:', response);
            },
            (error) => {
              console.error("Errore durante l'aggiunta dei vincitori:", error);
            }
          );
      } else if (result.tipo === 'sconfitta') {
        console.log('Sconfitta registrata');
        this.partitaSrv
          .aggiungiVincitoriAllaPartita2(
            partita.id!,
            result.compagno,
            result.tipo
          )
          .subscribe(
            (response) => {
              console.log('Vincitori aggiunti con successo:', response);
              // Esegui altre azioni necessarie dopo aver aggiunto i vincitori
            },
            (error) => {
              console.error("Errore durante l'aggiunta dei vincitori:", error);
              // Gestisci l'errore in modo appropriato
            }
          );
      }
      this.caricaPartite();
    });
  }

  apriModaleRisultato2(partita: Partita) {
    this.modalRef3 = this.modalSrv.open(ModalAggiungiVincitoriComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        utentiInput: partita.utentiPrenotati.filter(
          (utente) => utente.id !== this.user!.id
        ),
      },
    });

    this.modalRef3.onClose.subscribe((result) => {
      if (result.tipo === 'vittoria' || result.tipo === 'sconfitta') {
        this.userSrv.setDatiModal(result);

        this.modalRef3!.close();

        setTimeout(() => {
          this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
            modalClass: 'modal-dialog-centered',
            data: {
              messaggio: `Confermi il risultato: ${result.tipo}?`,
            },
          });

          this.modalRef.onClose.subscribe((confermato: boolean) => {
            if (confermato) {
              const datiModal = this.userSrv.getDatiModal();
              if (datiModal && datiModal.tipo && datiModal.compagno) {
                this.partitaSrv
                  .aggiungiVincitoriAllaPartita2(
                    partita.id!,
                    datiModal.compagno,
                    datiModal.tipo
                  )
                  .subscribe(
                    (response) => {
                      console.log('Vincitori aggiunti con successo:', response);
                      this.apriModaleConfermaRegistrazioneRisultato();
                      this.caricaPartite();
                    },
                    (error) => {
                      console.error(
                        "Errore durante l'aggiunta dei vincitori:",
                        error
                      );
                    }
                  );
              }
            }
          });
        }, 100);
      }
    });
  }

  apriModaleConfermaRegistrazioneRisultato() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Hai confermato il risultato',
      },
    });
  }
  utenteHaVinto(partita: Partita): boolean {
    return (
      partita.giocatoriVincenti &&
      partita.giocatoriVincenti.some((v) => v.id === this.user?.id)
    );
  }

  calcolaConteggioPartiteVinteEPersa() {
    this.conteggioPartiteVinte = 0;
    this.conteggioPartitePerse = 0;

    this.partitePassate.forEach((partita) => {
      if (this.utenteHaVinto(partita)) {
        this.conteggioPartiteVinte++;
      } else if (
        !this.utenteHaVinto(partita) &&
        partita.giocatoriVincenti.length == 2
      ) {
        this.conteggioPartitePerse++;
      }
    });
  }

  ngOnDestroy() {
    if (this.datiModalSubscription) {
      this.datiModalSubscription.unsubscribe();
    }
  }
}
