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

  onCambioData() {
    this.caricaPartite();
  }

  isFutureDate(dateStr: string, timeStr: string): boolean {
    const date = new Date(dateStr + 'T' + timeStr);
    return date > new Date();
  }

  formattaDataParole(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
  }

  apriModaleConfermaEliminazionePartita() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Partita eliminata correttamente',
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
        titolo: 'Vuoi eliminare la partita?',
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
        titolo: 'Prenotazione eliminata correttamente',
      },
    });
  }

  apriModaleAnnullaPrenotazione(partitaId: number, userId: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Vuoi annullare la prenotazione?',
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
              titolo: `Confermi il risultato: "${result.tipo}" per ${result.compagni[0].nome} ${result.compagni[0].cognome} e ${result.compagni[1].nome}  ${result.compagni[1].cognome} ?`,
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
            this.caricamento = false;
          });
        }, 100);
      }
    });
  }

  apriModaleConfermaRegistrazioneRisultato() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Hai confermato il risultato',
      },
    });
    this.modalRef2.onClose.subscribe(() => {
      this.caricamento = false;
    });
  }
}
