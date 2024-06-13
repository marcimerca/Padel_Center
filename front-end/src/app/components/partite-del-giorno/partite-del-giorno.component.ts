import { Component, OnInit } from '@angular/core';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-partite-del-giorno',
  templateUrl: './partite-del-giorno.component.html',
  styleUrls: ['./partite-del-giorno.component.scss'],
})
export class PartiteDelGiornoComponent implements OnInit {
  partite: Partita[] = [];

  constructor(private partitaSrv: PartitaService) {}

  ngOnInit() {
    this.partitaSrv.getPartitePerGiorno().subscribe((data) => {
      this.partite = data;
    });
  }

  aggiungi(partita: Partita) {
    const datiDaInviare = {
      dataPartita: partita.dataPartita,
      slotOrarioId: partita.slotOrario.id,
    };
    this.partitaSrv.aggiungiAPartita(datiDaInviare).subscribe(() => {
      console.log('Sei stato aggiunto alla partita');
    });
    this.partitaSrv.getPartitePerGiorno().subscribe((data) => {
      this.partite = data;
    });
  }
}
