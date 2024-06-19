import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  EmailValidator,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalConfermaComponent } from 'src/app/components/modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from 'src/app/components/modal-info/modal-info.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  modalRef: MdbModalRef<ModalInfoComponent> | null = null;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private modalSrv: MdbModalService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: this.fb.control(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      nome: this.fb.control(null, [Validators.required]),
      cognome: this.fb.control(null, Validators.required),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
    });
  }

  getErrorsControl(name: string, error: string) {
    return this.registerForm.get(name)?.errors![error];
  }

  getFormControl(name: string) {
    return this.registerForm.get(name);
  }

  register(form: FormGroup) {
    const emailControl = this.registerForm.get('email');
    const email = emailControl?.value;

    this.authSrv.checkEmailExists(email).subscribe((emailExists: boolean) => {
      if (emailExists) {
        emailControl?.setErrors({ alreadyExists: true });
      } else {
        this.authSrv.register(form.value).subscribe(
          () => {
            this.modalRef = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                messaggio: 'Registrazione avvenuta correttamente',
              },
            });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000);
          },
          (error) => {
            this.modalRef = this.modalSrv.open(ModalInfoComponent, {
              modalClass: 'modal-dialog-centered',
              data: {
                errorMessage:
                  error.error ||
                  "Si è verificato un errore durante l'aggiunta della partita. Riprova più tardi.",
              },
            });
            this.registerForm.get('password')?.setValue('');
          }
        );
      }
    });
  }
}
