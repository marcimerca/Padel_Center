import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalInfoComponent } from 'src/app/components/modal-info/modal-info.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private modalSrv: MdbModalService
  ) {}

  modalRef: MdbModalRef<ModalInfoComponent> | null = null;
  isLoading = false;

  login(form: NgForm) {
    this.isLoading = true;
    this.authSrv.login(form.value).subscribe(
      () => {
        setTimeout(() => {
          this.router.navigate(['partite-del-giorno']);
        }, 1000);
      },
      (error) => {
        this.isLoading = false;
        this.modalRef = this.modalSrv.open(ModalInfoComponent, {
          modalClass: 'modal-dialog-centered',
          data: {
            messaggio:
              error.error ||
              'Si è verificato un errore durante il login Riprova più tardi.',
          },
        });
      }
    );
  }
}
