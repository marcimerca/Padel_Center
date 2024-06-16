import { Component, OnInit } from '@angular/core';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-partite-del-giorno',
  templateUrl: './partite-del-giorno.component.html',
  styleUrls: ['./partite-del-giorno.component.scss'],
})
export class PartiteDelGiornoComponent implements OnInit {
  model!: NgbDateStruct;
  modalRef: MdbModalRef<ModalComponent> | null = null;
  dataSelezionata: string = '';
  dataOggi = false;

  partite: Partita[] = [];

  constructor(
    private partitaSrv: PartitaService,
    private modalService: MdbModalService
  ) {}

  ngOnInit() {
    this.caricaPartite();
  }

  caricaPartite() {
    if (this.dataSelezionata) {
      this.dataOggi = false;
      this.partitaSrv
        .getPartitePerData(this.dataSelezionata)
        .subscribe((data) => {
          this.partite = data.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.slotOrario.inizio}`);
            const timeB = new Date(`1970-01-01T${b.slotOrario.inizio}`);
            return timeA.getTime() - timeB.getTime();
          });
        });
    } else {
      this.dataOggi = true;
      this.partitaSrv.getPartiteOggi().subscribe((data) => {
        const now = new Date();
        this.partite = data
          .filter((partita) => {
            const partitaTime = new Date(
              `1970-01-01T${partita.slotOrario.inizio}`
            );
            return (
              partitaTime.getHours() > now.getHours() ||
              (partitaTime.getHours() === now.getHours() &&
                partitaTime.getMinutes() > now.getMinutes())
            );
          })
          .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.slotOrario.inizio}`);
            const timeB = new Date(`1970-01-01T${b.slotOrario.inizio}`);
            return timeA.getTime() - timeB.getTime();
          });
      });
    }
  }

  aggiungi(partita: Partita) {
    const datiDaInviare = {
      dataPartita: partita.dataPartita,
      slotOrarioId: partita.slotOrario.id,
    };

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(() => {
      this.partitaSrv.getPartiteOggi().subscribe((data) => {
        this.partite = data;
      });
      this.mostraFeedback('Sei stato aggiunto con successo alla partita!');
    });
  }

  mostraFeedback(messaggio: string) {
    alert(messaggio);
  }
  isButtonDisabled(slotOrarioInizio: string): boolean {
    const oraAttuale = new Date().toLocaleTimeString('it-IT', {
      hour12: false,
    });
    return oraAttuale > slotOrarioInizio;
  }
  openModal(partita: Partita) {
    this.modalRef = this.modalService.open(ModalComponent, {
      modalClass: 'modal-dialog-centered',
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
  isToday(data: string): boolean {
    const dataParam = new Date(data);

    const oggi = new Date();
    return (
      dataParam.getFullYear() === oggi.getFullYear() &&
      dataParam.getMonth() === oggi.getMonth() &&
      dataParam.getDate() === oggi.getDate()
    );
  }
  formatDate(data: string): string {
    const dataConvertita = new Date(data);
    const day = dataConvertita.getDate();
    const month = dataConvertita.getMonth() + 1;
    const year = dataConvertita.getFullYear();

    return `${day}-${month}-${year}`;
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
}
