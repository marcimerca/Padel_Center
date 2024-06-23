import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';

import { ModalPrenotazioneAdminComponent } from '../modal-prenotazione-admin/modal-prenotazione-admin.component';
import { SlotDisponibilita } from 'src/app/models/slot-disponibilita.interface';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  campi: Campo[] = [];
  campiDisp: CampoDisponibilita[] = [];
  dataSelezionata: string = '';
  dataOggi = false;
  numeroSlot: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  caricamento = false;

  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;
  modalRef3: MdbModalRef<ModalPrenotazioneAdminComponent> | null = null;

  slotSelezionati: SlotDisponibilita[] = [];
  AllSlotSelezionati: boolean = false;

  constructor(
    private campoSrv: CampoService,
    private partitaSrv: PartitaService,
    private router: Router,
    private modalSrv: MdbModalService
  ) {}
  ngOnInit() {
    this.campoSrv.getCampi().subscribe((campi) => {
      this.campi = campi;
    });
    this.slotSelezionati = [];
    this.caricaDisponibilita();
  }

  mostraDaOggi(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const formattedDate = `${year}-${this.padNumber(month)}-${this.padNumber(
      day
    )}`;
    return formattedDate;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  caricaDisponibilita() {
    const oggi = new Date().toISOString().split('T')[0];
    if (this.dataSelezionata) {
      this.dataOggi = this.dataSelezionata === oggi;

      this.campoSrv
        .getCampiConDisponibilita(this.dataSelezionata)
        .subscribe((data) => {
          this.campiDisp = data;
          console.log(this.campiDisp);
        });
    } else {
      this.dataOggi = true;
      this.campoSrv.getCampiConDisponibilita(oggi).subscribe((data) => {
        this.campiDisp = data;
        console.log(this.campiDisp);
      });
    }
  }

  onCambioData() {
    this.caricaDisponibilita();
  }

  creaPartita(idSlotOrario: number, dataPartita: string) {
    if (!dataPartita) {
      dataPartita = new Date().toISOString().slice(0, 10);
    }
    const datiDaInviare = {
      dataPrenotazione: dataPartita,
      slotOrarioId: idSlotOrario,
    };

    this.caricamento = true;

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(
      () => {
        console.log('Partita aggiunta con successo');
        this.caricamento = false;
        this.apriModale2();

        setTimeout(() => {
          this.router.navigate(['/profilo-utente']);
        }, 1000);
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

  formatattaData(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
  }

  apriModale2() {
    this.modalRef2 = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'La partita è stata creata con successo',
      },
    });
  }

  verificaBottoneDisabilitato(orarioInizio: string): boolean {
    const oggi = new Date();
    const oraCorrente = oggi.getHours();
    const [oraSlot] = orarioInizio.split(':').map(Number);

    if (this.dataOggi) {
      return oraCorrente >= oraSlot;
    }
    return false;
  }

  apriModale(idSlotOrario: number, dataPartita: string) {
    this.modalRef3 = this.modalSrv.open(ModalPrenotazioneAdminComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Inserire il motivo della prenotazione',
      },
    });

    this.modalRef3.onClose.subscribe((result: string) => {
      if (result !== 'annulla') {
        this.prenotaAdmin(idSlotOrario, dataPartita, result);
      } else {
        this.slotSelezionati = [];
      }
    });
  }

  prenotaFasciaOraria(dataPartita: string) {
    if (this.slotSelezionati.length > 0) {
      this.modalRef3 = this.modalSrv.open(ModalPrenotazioneAdminComponent, {
        modalClass: 'modal-dialog-centered',
        data: {
          messaggio: 'Inserire il motivo della prenotazione',
        },
      });

      this.modalRef3.onClose.subscribe((result: string) => {
        if (result !== 'annulla') {
          const ids = this.slotSelezionati.map((slot) => slot.id!);
          console.log('Slot selezionati per la prenotazione:', ids);
          ids.forEach((id) => {
            this.prenotaAdmin(id, dataPartita, result);
          });
          this.slotSelezionati = [];
          this.apriModaleConfermaPrenotazione();
        } else {
          this.slotSelezionati = [];
        }
      });
    }
  }

  selezionaSlot(slot: SlotDisponibilita) {
    const index = this.slotSelezionati.findIndex((s) => s.id === slot.id);
    if (index > -1) {
      this.slotSelezionati.splice(index, 1);
      console.log(`Slot deselezionato: ${slot.id}`);
      this.caricaDisponibilita();
    } else {
      this.slotSelezionati.push(slot);
      console.log(`Slot selezionato: ${slot.id}`);
    }
    console.log(
      'Slot attualmente selezionati:',
      this.slotSelezionati.map((s) => s.id)
    );
  }

  prenotaAdmin(
    idSlotOrario: number,
    dataPartita: string,
    motivoPrenotazione: string
  ) {
    if (!dataPartita) {
      dataPartita = new Date().toISOString().slice(0, 10);
    }

    const datiDaInviare = {
      dataPrenotazione: dataPartita,
      slotOrarioId: idSlotOrario,
      motivoPrenotazione: motivoPrenotazione,
    };

    console.log('Dati da inviare:', datiDaInviare);

    this.partitaSrv.savePrenotazioneAdmin(datiDaInviare).subscribe(
      () => {
        console.log('Prenotazione aggiunta con successo');

        this.caricaDisponibilita();
      },
      (error) => {
        console.error("Errore durante l'aggiunta della prenotazione:", error);
      }
    );
  }

  apriModaleConfermaPrenotazione() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Hai creato correttamente la tua prenotazione',
      },
    });
  }
  apriModaleAnnulla() {
    if (this.slotSelezionati.length > 0) {
      this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
        modalClass: 'modal-dialog-centered',
        data: {
          messaggio: 'Vuoi cancellare la prenotazione?',
        },
      });

      this.modalRef.onClose.subscribe((result: string) => {
        if (!this.dataSelezionata) {
          this.dataSelezionata = new Date().toISOString().slice(0, 10);
        }
        if (result === 'conferma') {
          this.slotSelezionati.forEach((slot) => {
            this.partitaSrv
              .findPrenotazioneBySlotAndData(slot.id!, this.dataSelezionata)
              .subscribe(
                (prenotazione) => {
                  this.partitaSrv
                    .annullaPrenotazioneAdmin(prenotazione.id!)
                    .subscribe(() => {
                      console.log(
                        'La prenotazione è stata annullata correttamente'
                      );
                      this.caricaDisponibilita();
                    });
                },
                (error) => {
                  console.error(
                    'Errore durante la ricerca della prenotazione:',
                    error
                  );
                }
              );
          });
          this.slotSelezionati = [];
        } else {
          this.slotSelezionati = [];
        }
      });
    }
  }

  selezionaTuttiGliSlot() {
    if (this.slotSelezionati.length > 0) {
      this.slotSelezionati = [];
    } else {
      this.slotSelezionati = [];
      this.campiDisp.forEach((campo) => {
        campo.slotOrari.forEach((slot) => {
          this.slotSelezionati.push(slot);
        });
      });
      console.log(
        'Tutti gli slot selezionati:',
        this.slotSelezionati.map((s) => s.id)
      );
    }
  }

  selezionaTuttiGliSlotNonOccupati() {
    if (this.slotSelezionati.length > 0) {
      this.slotSelezionati = [];
    } else {
      this.slotSelezionati = [];
      this.campiDisp.forEach((campo) => {
        campo.slotOrari.forEach((slot) => {
          if (
            !slot.occupato &&
            !this.verificaBottoneDisabilitato(slot.inizio)
          ) {
            this.slotSelezionati.push(slot);
          }
        });
      });
      console.log(
        'Tutti gli slot selezionati:',
        this.slotSelezionati.map((s) => s.id)
      );
    }
  }

  selezionaTuttiGliSlotDelCampo(campo: CampoDisponibilita) {
    if (this.slotSelezionati.length > 0) {
      this.slotSelezionati = [];
    } else {
      this.slotSelezionati = [];

      campo.slotOrari.forEach((slot) => {
        if (!slot.occupato && !this.verificaBottoneDisabilitato(slot.inizio)) {
          this.slotSelezionati.push(slot);
        }
      });
    }
  }

  isSlotSelected(slot: SlotDisponibilita): boolean {
    return this.slotSelezionati.some((s) => s.id === slot.id);
  }

  sonoSlotPrenotati(): boolean {
    return this.slotSelezionati.every((slot) => slot.occupato);
  }

  // apriModale(idSlotOrario: number, dataPartita: string) {
  //   this.modalRef3 = this.modalSrv.open(ModalPrenotazioneAdminComponent, {
  //     modalClass: 'modal-dialog-centered',
  //     data: {
  //       messaggio: 'Inserire il motivo della prenotazione',
  //     },
  //   });

  //   this.modalRef3.onClose.subscribe((result: string) => {
  //     if (result !== 'annulla') {
  //       this.prenotaAdmin(idSlotOrario, dataPartita, result);
  //     }
  //   });
  // // }

  // apriModale(idSlotOrario: number, dataPartita: string) {
  //   this.modalRef3 = this.modalSrv.open(ModalPrenotazioneAdminComponent, {
  //     modalClass: 'modal-dialog-centered',
  //     data: {
  //       messaggio: 'Inserire il motivo della prenotazione',
  //     },
  //   });

  //   this.modalRef3.onClose.subscribe((result: string) => {
  //     if (result !== 'annulla') {
  //       this.prenotaAdmin(idSlotOrario, dataPartita, result);
  //     }
  //   });
  // }
}
