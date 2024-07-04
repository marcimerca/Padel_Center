import { Component, OnInit } from '@angular/core';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthData } from 'src/app/models/auth-data.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalInfoComponent } from '../modals/modal-info/modal-info.component';
import { ModalConfermaComponent } from '../modals/modal-conferma/modal-conferma.component';

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
  oggi = new Date().toISOString().split('T')[0];

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
    if (this.dataSelezionata) {
      this.dataOggi = this.dataSelezionata === this.oggi;

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
      dataPrenotazione: partita.dataPrenotazione,
      slotOrarioId: partita.slotOrario.id,
    };
    this.caricamento = true;

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(
      () => {
        this.partitaSrv.getPartiteOggi().subscribe((data) => {
          this.caricamento = false;
          setTimeout(() => {
            this.apriModaleConfermaAggiunta();
          }, 200);

          setTimeout(() => {
            this.router.navigate(['/profilo-utente']);
            this.partite = data;
          }, 1000);
        });
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

  verificaUtenteGiaAggiunto(partita: Partita): boolean {
    return partita.utentiPrenotati.some(
      (utente) => utente.id === this.user!.id
    );
  }

  apriModalePartecipa(partita: Partita) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Confermi di voler partecipare alla partita?',
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

  formattaDataParole(data: string): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(data));
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

  apriModaleConfermaAggiunta() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Sei stato aggiunto correttamente alla partita',
      },
    });
  }
}
