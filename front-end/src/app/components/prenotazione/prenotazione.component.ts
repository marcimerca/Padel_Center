import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';

import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { ModalConfermaComponent } from '../modals/modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modals/modal-info/modal-info.component';
import { SlotDisponibilita } from 'src/app/models/slot-disponibilita.interface';
import { Partita } from 'src/app/models/partita.interface';

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
    this.caricamento = true;
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
          this.caricamento = false;
          console.log(this.campiDisp);
        });
    } else {
      this.dataOggi = true;
      this.campoSrv.getCampiConDisponibilita(oggi).subscribe((data) => {
        this.campiDisp = data;
        this.caricamento = false;
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
        this.apriModaleConfermaCreazionePartita();
      },
      (error) => {
        console.error("Errore durante l'aggiunta della partita:", error);
        this.caricamento = false;

        this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
          modalClass: 'modal-dialog-centered',
          data: {
            titolo:
              error.error ||
              "Si è verificato un errore durante l'aggiunta della partita. Riprova più tardi.",
          },
        });
      }
    );
  }

  formattaDataParole(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
  }

  apriModaleCreazionePartita(
    idSlotOrario: number,
    dataPartita: string,
    inizio: string,
    fine: string
  ) {
    if (!dataPartita) {
      dataPartita = new Date().toISOString().slice(0, 10);
    }
    let dataPartitaFormattata = this.formattaDataParole(dataPartita);

    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: `Confermi di voler creare la partita per il ${dataPartitaFormattata}, dalle ${inizio.slice(
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

  apriModaleConfermaCreazionePartita() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'La partita è stata creata con successo',
      },
    });
    this.modalRef2.onClose.subscribe(() => {
      this.caricamento = true;
      setTimeout(() => {
        this.router.navigate(['/profilo-utente']);
      }, 600);
      this.caricamento = false;
    });
  }

  verificaBottoneDisabilitato(orarioInizio: string): boolean {
    const oggi = new Date();
    const oraCorrente = oggi.getHours();
    const minutiCorrenti = oggi.getMinutes();
    const [oraSlot, minutiSlot] = orarioInizio.split(':').map(Number);

    if (this.dataOggi) {
      return (
        oraCorrente > oraSlot ||
        (oraCorrente === oraSlot && minutiCorrenti >= minutiSlot)
      );
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

  scrollToCampo(campoId: number): void {
    const elemento = document.getElementById(campoId.toString());
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'end' });
      elemento.classList.add('highlight');
      setTimeout(() => {
        elemento.classList.remove('highlight');
      }, 2000); // Rimuove la classe dopo 2 secondi
    }
  }
}
