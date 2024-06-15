import { Component, OnInit } from '@angular/core';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-partite-del-giorno',
  templateUrl: './partite-del-giorno.component.html',
  styleUrls: ['./partite-del-giorno.component.scss'],
})
export class PartiteDelGiornoComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent> | null = null;

  partite: Partita[] = [];

  constructor(
    private partitaSrv: PartitaService,
    private modalService: MdbModalService
  ) {}

  ngOnInit() {
    this.partitaSrv.getPartitePerGiorno().subscribe((data) => {
      const now = new Date();
      this.partite = data.filter((partita) => {
        const partitaTime = new Date(`1970-01-01T${partita.slotOrario.inizio}`);
        return (
          partitaTime.getHours() > now.getHours() ||
          (partitaTime.getHours() === now.getHours() &&
            partitaTime.getMinutes() > now.getMinutes())
        );
      });
      console.log(this.partite);
    });
  }

  aggiungi(partita: Partita) {
    const datiDaInviare = {
      dataPartita: partita.dataPartita,
      slotOrarioId: partita.slotOrario.id,
    };

    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(() => {
      this.partitaSrv.getPartitePerGiorno().subscribe((data) => {
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
}
