import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { SlotDisponibilita } from 'src/app/models/slot-disponibilita.interface';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.scss'],
})
export class PrenotazioneComponent implements OnInit {
  campi: Campo[] = [];
  campiDisp: CampoDisponibilita[] = [];
  dataSelezionata: string = '';
  dataOggi = false;
  numeroSlot: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  caricamento = false;
  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;

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
      motivoPrenotazione: 'partita',
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

  apriModale(
    idSlotOrario: number,
    dataPartita: string,
    inizio: string,
    fine: string
  ) {
    if (!dataPartita) {
      dataPartita = new Date().toISOString().slice(0, 10);
    }
    let dataPartitaFormattata = this.formatattaData(dataPartita);

    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: `Confermi di voler creare la partita per il ${dataPartitaFormattata}, dalle ${inizio.slice(
          0,
          5
        )} alle ${fine.slice(0, 5)} ?`,
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.creaPartita(idSlotOrario, dataPartita);
      }
    });
  }

  apriModale2() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
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
  getNumMaxSlotsArray(): any[] {
    let maxSlots = 0;
    this.campiDisp.forEach((campo) => {
      if (campo.slotOrari.length > maxSlots) {
        maxSlots = campo.slotOrari.length;
      }
    });
    return Array.from({ length: maxSlots }, (_, i) => ({ index: i }));
  }
  isSlotSelected(slot: SlotDisponibilita): boolean {
    return this.slotSelezionati.some((s) => s.id === slot.id);
  }
}
