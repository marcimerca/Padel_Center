import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ModalAggiungiVincitoriAdminComponent } from '../modal-aggiungi-vincitori-admin/modal-aggiungi-vincitori-admin.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gestione-partite-admin',
  templateUrl: './gestione-partite-admin.component.html',
  styleUrls: ['./gestione-partite-admin.component.scss'],
})
export class GestionePartiteAdminComponent implements OnInit {
  user!: AuthData | null;
  model!: NgbDateStruct;
  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;
  modalRef3: MdbModalRef<ModalAggiungiVincitoriAdminComponent> | null = null;
  oggi = new Date().toISOString().split('T')[0];
  partitaBloccata = false;

  dataSelezionata: string = '';
  dataOggi = false;

  partite: Partita[] = [];
  caricamento = false;

  constructor(
    private partitaSrv: PartitaService,
    private modalSrv: MdbModalService,
    private router: Router,
    private authSrv: AuthService,
    private userSrv: UserService
  ) {}

  ngOnInit() {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
    this.caricaPartite();
  }

  caricaPartite() {
    if (this.dataSelezionata) {
      this.dataOggi = this.dataSelezionata === this.oggi;
      this.partitaSrv
        .getPartitePerData(this.dataSelezionata)
        .subscribe((data) => {
          const partiteFiltrate = data.sort((a, b) => this.ordinaPartite(a, b));

          this.partite = partiteFiltrate;
        });
    } else {
      this.dataOggi = true;
      this.partitaSrv.getPartiteOggi().subscribe((data) => {
        const partiteFiltrate = data.sort((a, b) => this.ordinaPartite(a, b));

        this.partite = partiteFiltrate;
      });
    }
  }

  ordinaPartite(a: Partita, b: Partita): number {
    const timeA = new Date(`1970-01-01T${a.slotOrario.inizio}`);
    const timeB = new Date(`1970-01-01T${b.slotOrario.inizio}`);
    const timeComparison = timeA.getTime() - timeB.getTime();
    if (timeComparison !== 0) {
      return timeComparison;
    }
    return a.id! - b.id!;
  }

  aggiungi(partita: Partita) {
    const datiDaInviare = {
      dataPrenotazione: partita.dataPrenotazione,
      slotOrarioId: partita.slotOrario.id,
    };
    this.caricamento = true;

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(
      () => {
        this.partitaSrv.getPartiteOggi().subscribe((data) => {
          this.partite = data;
        });
        this.caricamento = false;
        this.apriModale2();
      },
      (error) => {
        console.error("Errore durante l'aggiunta della partita:", error);
        this.caricamento = false;
        this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
          modalClass: 'modal-dialog-centered',
          data: {
            messaggio:
              error.error ||
              "Si è verificato un errore durante l'aggiunta della partita. Riprova più tardi.",
          },
        });
      }
    );
  }

  verificaUtenteGiaAggiunto(partita: Partita): boolean {
    return partita.utentiPrenotati.some(
      (utente) => utente.id === this.user!.id
    );
  }

  isButtonDisabled(slotOrarioInizio: string): boolean {
    const oraAttuale = new Date().toLocaleTimeString('it-IT', {
      hour12: false,
    });
    return oraAttuale > slotOrarioInizio;
  }
  apriModale(partita: Partita) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Confermi di voler partecipare alla partita?',
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.aggiungi(partita);
      }
    });
  }

  onCambioData() {
    this.caricaPartite();
  }

  isToday(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  isFutureDate(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    return date > new Date();
  }

  isFutureDateMoreThan24Hours(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    const now = new Date();

    const timeDiff = date.getTime() - now.getTime();

    return timeDiff > 24 * 60 * 60 * 1000;
  }
  formattaData(data: string): string {
    const dataConvertita = new Date(data);
    const day = dataConvertita.getDate();
    const month = dataConvertita.getMonth() + 1;
    const year = dataConvertita.getFullYear();

    return `${day}-${month}-${year}`;
  }
  formatattaDataParole(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
  }

  // mostraDaOggi(): string {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = today.getMonth() + 1;
  //   const day = today.getDate();

  //   const formattedDate = `${year}-${this.padNumber(month)}-${this.padNumber(
  //     day
  //   )}`;
  //   return formattedDate;
  // }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  apriModale2() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Sei stato aggiunto correttamente alla partita',
      },
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

  annullaPrenotazione(partitaId: number, userId: number) {
    this.partitaSrv
      .annullaPrenotazionePartitaAdmin(partitaId, userId)
      .subscribe(() => {
        console.log('La prenotazione è stata annullata correttamente');
        this.caricaPartite();
        this.apriModaleConfermaEliminazionePrenotazioneUtente();
      });
  }

  apriModaleConfermaEliminazionePrenotazioneUtente() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Prenotazione eliminata correttamente',
      },
    });
  }

  apriModaleAnnullaPrenotazione(partitaId: number, userId: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Vuoi annullare la prenotazione?',
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.annullaPrenotazione(partitaId, userId);
      }
    });
  }

  bloccaESbloccaPartecipazione(id: number): void {
    this.partitaSrv.completaPartita(id).subscribe(() => {
      this.caricaPartite();
    });
  }

  apriModaleRisultato2(partita: Partita) {
    this.modalRef3 = this.modalSrv.open(ModalAggiungiVincitoriAdminComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        utentiInput: partita.utentiPrenotati,
      },
    });

    this.modalRef3.onClose.subscribe((result) => {
      if (result.tipo === 'vittoria' || result.tipo === 'sconfitta') {
        this.userSrv.setDatiModalAdmin(result);

        this.modalRef3!.close();

        setTimeout(() => {
          this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
            modalClass: 'modal-dialog-centered',
            data: {
              messaggio: `Confermi il risultato: "${result.tipo}" per ${result.compagni[0].nome} ${result.compagni[0].cognome} e ${result.compagni[1].nome}  ${result.compagni[1].cognome} ?`,
            },
          });

          this.modalRef.onClose.subscribe((confermato: boolean) => {
            this.caricamento = true;
            if (confermato) {
              const datiModalAdmin = this.userSrv.getDatiModalAdmin();
              if (
                datiModalAdmin &&
                datiModalAdmin.tipo &&
                datiModalAdmin.compagni
              ) {
                this.partitaSrv
                  .aggiungiVincitoriAllaPartitaAdmin(
                    partita.id!,
                    datiModalAdmin.compagni,
                    datiModalAdmin.tipo
                  )
                  .subscribe(
                    (response) => {
                      console.log('Vincitori aggiunti con successo:', response);
                      this.caricamento = false;

                      this.apriModaleConfermaRegistrazioneRisultato();
                      this.caricaPartite();
                    },
                    (error) => {
                      this.caricamento = false;
                      console.error(
                        "Errore durante l'aggiunta del risultato",
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
}
