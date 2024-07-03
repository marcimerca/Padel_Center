import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { SlotDisponibilita } from 'src/app/models/slot-disponibilita.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ModalPrenotazioneAdminComponent } from '../modal-prenotazione-admin/modal-prenotazione-admin.component';
import { ModalCreazioneCampoAdminComponent } from '../modal-creazione-campo-admin/modal-creazione-campo-admin.component';
import { ModalAggiuntaSlotAdminComponent } from '../modal-aggiunta-slot-admin/modal-aggiunta-slot-admin.component';

@Component({
  selector: 'app-gestione-campi-admin',
  templateUrl: './gestione-campi-admin.component.html',
  styleUrls: ['./gestione-campi-admin.component.scss'],
})
export class GestioneCampiAdminComponent implements OnInit {
  campi: Campo[] = [];
  campiDisp: CampoDisponibilita[] = [];
  dataSelezionata: string = '';
  dataOggi = false;
  caricamento = false;

  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;
  modalRef3: MdbModalRef<ModalPrenotazioneAdminComponent> | null = null;
  modalRefCreazioneCampo: MdbModalRef<ModalCreazioneCampoAdminComponent> | null =
    null;
  modalRefAggiuntaSlot: MdbModalRef<ModalAggiuntaSlotAdminComponent> | null =
    null;

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

  getNumMaxSlotsArray(): any[] {
    let maxSlots = 0;
    this.campiDisp.forEach((campo) => {
      if (campo.slotOrari.length > maxSlots) {
        maxSlots = campo.slotOrari.length;
      }
    });
    return Array.from({ length: maxSlots }, (_, i) => ({ index: i }));
  }

  apriModaleCreaCampo() {
    this.modalRefCreazioneCampo = this.modalSrv.open(
      ModalCreazioneCampoAdminComponent,
      {
        modalClass: 'modal-dialog-centered',
        data: {
          messaggio: 'Inserire il nome del campo',
        },
      }
    );
    this.modalRefCreazioneCampo.onClose.subscribe((result: string) => {
      if (result !== 'annulla') {
        const datiDaInviare = {
          nomeCampo: result,
        };
        this.campoSrv.creaCampo(datiDaInviare).subscribe(
          () => {
            console.log(`Campo ${result} creato con successo`);
            this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio: 'Campo aggiunto correttamente',
              },
            });
            this.caricaDisponibilita();
          },
          (error) => {
            console.error('Errore durante la creazione del campo', error);
          }
        );
      }
    });
  }

  apriModaleModificaNomeCampo(id: number) {
    this.modalRefCreazioneCampo = this.modalSrv.open(
      ModalCreazioneCampoAdminComponent,
      {
        modalClass: 'modal-dialog-centered',
        data: {
          messaggio: 'Inserire il nuovo nome del campo',
        },
      }
    );
    this.modalRefCreazioneCampo.onClose.subscribe((result: string) => {
      if (result !== 'annulla') {
        const datiDaInviare = {
          nomeCampo: result,
        };
        console.log(datiDaInviare);
        this.campoSrv.modificaNomeCampo(id, datiDaInviare).subscribe(
          () => {
            console.log(`Campo ${result} modificato con successo`);
            this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio: 'Nome del campo modificato correttamente',
              },
            });
            this.caricaDisponibilita();
          },
          (error) => {
            console.error(
              'Errore durante la modifica del nome del campo',
              error
            );
          }
        );
      }
    });
  }

  apriModaleEliminaCampo(id: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Eliminazione Campo',
        messaggio:
          "Vuoi eliminare il campo? L'eliminazione comporterà la cancellazione di tutte le prenotazioni relative al campo",
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.campoSrv.eliminaCampo(id).subscribe(
          () => {
            console.log('Campo eliminato correttamente');
            this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio: 'Campo eliminato correttamente',
              },
            });
            this.caricaDisponibilita();
          },
          (error) => {
            console.error("Errore durante l'eliminazione del campo:", error);
          }
        );
      }
    });
  }

  apriModaleAggiuntaSlot(campoId: number) {
    this.modalRefAggiuntaSlot = this.modalSrv.open(
      ModalAggiuntaSlotAdminComponent,
      {
        modalClass: 'modal-dialog-centered',
        data: {
          messaggio: 'Inserire inizio dello slot orario (ex: 09:00)',
        },
      }
    );
    this.modalRefAggiuntaSlot.onClose.subscribe((result: string) => {
      if (result !== 'annulla') {
        const datiDaInviare = {
          inizio: result,
          campoId: campoId,
        };
        console.log('dati da inviare', datiDaInviare);
        this.campoSrv.aggiungiSlotOrario(datiDaInviare).subscribe(
          () => {
            console.log('slot aggiunto correttamente');
            this.caricaDisponibilita();
          },
          (error) => {
            console.error("Errore durante l'aggiunta dello slot:", error);
            this.caricamento = false;

            this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio:
                  error.error ||
                  "Si è verificato un errore durante l'aggiunta dello slot. Riprova più tardi.",
              },
            });
          }
        );
      }
    });
  }

  apriModaleEliminaSlot(id: number) {
    setTimeout(() => {
      this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
        modalClass: 'modal-dialog-centered',
        data: {
          titolo: 'Eliminazione slot',
          messaggio:
            "Vuoi eliminare lo slot orario? L'eliminazione comporterà la cancellazione di tutte le prenotazioni relative allo slot di questo campo",
        },
      });

      this.modalRef.onClose.subscribe((result: string) => {
        if (result === 'conferma') {
          this.campoSrv.eliminaSlotOrario(id).subscribe(
            () => {
              console.log('Slot orario eliminato correttamente');

              this.modalRef!.close();
              setTimeout(() => {
                this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
                  modalClass: 'modal-dialog-centered',
                  data: {
                    messaggio: 'Slot orario eliminato correttamente',
                  },
                });
                this.caricaDisponibilita();
              }, 300);
            },
            (error) => {
              console.error("Errore durante l'eliminazione dello slot:", error);
            }
          );
        }
      });
    }, 300);
  }

  apriModaleEliminaTuttiSlotCampo(id: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Eliminazione di tutti gli slot',
        messaggio:
          "Vuoi eliminare tutti gli slot orari del campo? L'eliminazione comporterà la cancellazione di tutte le prenotazioni di questo campo",
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.campoSrv.eliminaTuttiSlotOrariCampo(id).subscribe(
          () => {
            console.log(
              'Tutti gli slot orari del campo sono stati eliminati correttamente'
            );
            this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio:
                  'Tutti gli slot orari del campo sono stati eliminati correttamente',
              },
            });
            this.caricaDisponibilita();
          },
          (error) => {
            console.error(
              "Errore durante l'eliminazione degli slot del campo:",
              error
            );
          }
        );
      }
    });
  }

  // parte ripresa dalla gestione disponibilità, da rimuovere/ aggiornare

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
        campo.slotOrari.forEach((slot) => {});
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
        this.slotSelezionati.push(slot);
      });
    }
  }
}
