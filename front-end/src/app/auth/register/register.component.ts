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
  avatarFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private modalSrv: MdbModalService
  ) {}
  ngOnInit() {
    this.registerForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(5)]],
      nome: [null, [Validators.required]],
      cognome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
    });
  }

  getErrorsControl(name: string, error: string) {
    return this.registerForm.get(name)?.errors![error];
  }

  getFormControl(name: string) {
    return this.registerForm.get(name);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
    }
  }

  register() {
    if (this.registerForm.valid) {
      const emailControl = this.registerForm.get('email');
      const email = emailControl?.value;

      this.authSrv.checkEmailExists(email).subscribe((emailExists: boolean) => {
        if (emailExists) {
          emailControl?.setErrors({ alreadyExists: true });
        } else {
          const formData = new FormData();
          formData.append('username', this.registerForm.get('username')?.value);
          formData.append('nome', this.registerForm.get('nome')?.value);
          formData.append('cognome', this.registerForm.get('cognome')?.value);
          formData.append('email', this.registerForm.get('email')?.value);
          formData.append('password', this.registerForm.get('password')?.value);
          if (this.avatarFile) {
            formData.append('avatar', this.avatarFile);
          }

          this.authSrv.registerConFoto(formData).subscribe(
            () => {
              this.modalRef = this.modalSrv.open(ModalInfoComponent, {
                modalClass: 'modal-dialog-centered',
                data: { messaggio: 'Registrazione avvenuta correttamente' },
              });
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            },
            (error) => {
              this.modalRef = this.modalSrv.open(ModalInfoComponent, {
                modalClass: 'modal-dialog-centered',
                data: {
                  messaggio:
                    error.error ||
                    'Si è verificato un errore durante la registrazione. Riprova più tardi.',
                },
              });
              this.registerForm.get('password')?.setValue('');
            }
          );
        }
      });
    }
  }
}
