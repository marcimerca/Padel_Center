import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';
import { Partita } from 'src/app/models/partita.interface';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-profilo-utente',
  templateUrl: './profilo-utente.component.html',
  styleUrls: ['./profilo-utente.component.scss'],
})
export class ProfiloUtenteComponent implements OnInit {
  user!: AuthData | null;
  partiteUser!: Partita[];

  constructor(
    private authSrv: AuthService,
    private partitaSrv: PartitaService
  ) {}
  ngOnInit() {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
      if (this.user && this.user.id) {
        this.partitaSrv
          .findPartiteByUserId(this.user.id)
          .subscribe((partite) => {
            this.partiteUser = partite;
          });
      }
    });
  }
}
