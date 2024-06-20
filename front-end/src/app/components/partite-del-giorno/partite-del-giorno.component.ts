import { Component, OnInit } from '@angular/core';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthData } from 'src/app/models/auth-data.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';

@Component({
  selector: 'app-partite-del-giorno',
  templateUrl: './partite-del-giorno.component.html',
  styleUrls: ['./partite-del-giorno.component.scss'],
})
export class PartiteDelGiornoComponent implements OnInit {
  user!: AuthData | null;
  model!: NgbDateStruct;
  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;

  dataSelezionata: string = '';
  dataOggi = false;
  mostraDatePicker: boolean = false;
  partite: Partita[] = [];
  caricamento = false;

  constructor(
    private partitaSrv: PartitaService,
    private modalSrv: MdbModalService,
    private router: Router,
    private authSrv: AuthService
  ) {}

  ngOnInit() {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
    this.caricaPartite();
  }

  caricaPartite() {
    const oggi = new Date().toISOString().split('T')[0];

    if (this.dataSelezionata) {
      this.dataOggi = this.dataSelezionata === oggi;

      this.partitaSrv
        .getPartitePerData(this.dataSelezionata)
        .subscribe((data) => {
          this.partite = data
            .filter((partita) => {
              if (this.dataOggi) {
                const now = new Date();
                const partitaTime = new Date(
                  `1970-01-01T${partita.slotOrario.inizio}`
                );
                return (
                  partitaTime.getHours() > now.getHours() ||
                  (partitaTime.getHours() === now.getHours() &&
                    partitaTime.getMinutes() > now.getMinutes())
                );
              }
              return true;
            })
            .sort((a, b) => {
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
    this.caricamento = true;

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(
      () => {
        this.partitaSrv.getPartiteOggi().subscribe((data) => {
          this.partite = data;
        });
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

  apriModale2() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        messaggio: 'Sei stato aggiunto correttamente alla partita',
      },
    });
  }
}
