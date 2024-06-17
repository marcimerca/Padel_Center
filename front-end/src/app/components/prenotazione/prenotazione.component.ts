import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampoDisponibilita } from 'src/app/models/campo-disponibilita.interface';
import { Campo } from 'src/app/models/campo.interface';
import { Partita } from 'src/app/models/partita.interface';
import { CampoService } from 'src/app/services/campo.service';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalCreazionePartitaComponent } from '../modal-creazione-partita/modal-creazione-partita.component';
import { ModalConfermaPrenotazioneComponent } from '../modal-conferma-prenotazione/modal-conferma-prenotazione.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SlotOrario } from 'src/app/models/slot-orario.interface';
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
  modalRef: MdbModalRef<ModalCreazionePartitaComponent> | null = null;
  modalRef2: MdbModalRef<ModalConfermaPrenotazioneComponent> | null = null;

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
      dataPartita: dataPartita,
      slotOrarioId: idSlotOrario,
    };

    const conferma = confirm('Sei sicuro di voler aggiungere questa partita?');
    if (!conferma) {
      return;
    }
    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(
      () => {
        console.log('Partita aggiunta con successo');

        alert('La partita è stata aggiunta con successo!');

        setTimeout(() => {
          this.router.navigate(['/profilo-utente']);
        }, 1000);
      },
      (error) => {
        console.error("Errore durante l'aggiunta della partita:", error);
        alert(
          "Si è verificato un errore durante l'aggiunta della partita. Riprova più tardi."
        );
        this.caricamento = false;
      }
    );
  }
}
