import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { FilterUsers } from 'src/app/pipes/filter-users.pipe';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalConfermaComponent } from '../modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchText: string = '';
  modalRef: MdbModalRef<ModalConfermaComponent> | null = null;
  modalRef2: MdbModalRef<ModalInfoComponent> | null = null;

  constructor(
    private userSrv: UserService,
    private modalSrv: MdbModalService
  ) {}

  ngOnInit() {
    this.caricaUsers();
  }

  caricaUsers() {
    this.userSrv.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
  deleteUser(userId: number) {
    this.userSrv.deleteUser(userId).subscribe(() => {
      console.log('Utente elimianto con successo');
      this.caricaUsers();
      this.apriModaleConfermaEliminazioneUtente();
    });
  }

  apriModaleEliminaUtente(userId: number) {
    this.modalRef = this.modalSrv.open(ModalConfermaComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: 'Eliminazione utente',
        messaggio:
          "Attenzione, vuoi eliminare l'utente? Verranno eliminate anche tutte le sue prenotazioni",
      },
    });

    this.modalRef.onClose.subscribe((result: string) => {
      if (result === 'conferma') {
        this.deleteUser(userId);
      }
    });
  }

  apriModaleConfermaEliminazioneUtente() {
    this.modalRef2 = this.modalSrv.open(ModalInfoComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        titolo: "Hai eliminato correttamente l'utente",
      },
    });
  }
}
