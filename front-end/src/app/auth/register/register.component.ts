import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  EmailValidator,
  NgForm,
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
  fileError: string | null = null;
  isLogin: boolean = true;
  isLoading: boolean = false;
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
      avatar: [null],
    });
  }

  caricaFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Solo immagini sono consentite.';
        this.avatarFile = null;
      } else if (file.size > 5 * 1024 * 1024) {
        this.fileError =
          'Il file è troppo grande. La dimensione massima consentita è di 5MB.';
        this.avatarFile = null;
      } else {
        this.fileError = null;
        this.avatarFile = file;
      }
    }
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
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

      const usernameControl = this.registerForm.get('username');
      const username = usernameControl?.value;

      this.authSrv.checkEmailExists(email).subscribe((emailExists: boolean) => {
        if (emailExists) {
          emailControl?.setErrors({ alreadyExists: true });
        } else {
          this.authSrv
            .checkUsernameExists(username)
            .subscribe((usernameExists: boolean) => {
              if (usernameExists) {
                usernameControl?.setErrors({ alreadyExists: true });
              } else {
                const formData = new FormData();
                formData.append(
                  'username',
                  this.registerForm.get('username')?.value
                );
                formData.append('nome', this.registerForm.get('nome')?.value);
                formData.append(
                  'cognome',
                  this.registerForm.get('cognome')?.value
                );
                formData.append('email', this.registerForm.get('email')?.value);
                formData.append(
                  'password',
                  this.registerForm.get('password')?.value
                );
                if (this.avatarFile) {
                  formData.append('avatar', this.avatarFile);
                }

                this.authSrv.registerConFoto(formData).subscribe(
                  () => {
                    this.modalRef = this.modalSrv.open(ModalInfoComponent, {
                      modalClass: 'modal-dialog-centered',
                      data: {
                        messaggio: 'Registrazione avvenuta correttamente',
                      },
                    });
                    setTimeout(() => {
                      this.isLogin = true;
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
      });
    }
  }

  login(form: NgForm) {
    this.isLoading = true;
    this.authSrv.login(form.value).subscribe(
      (user) => {
        setTimeout(() => {
          this.isLoading = false;
          if (user.ruolo === 'ADMIN') {
            this.router.navigate(['admin-dashboard']);
          } else {
            this.router.navigate(['partite-del-giorno']);
          }
        }, 1000);
      },
      (error) => {
        this.isLoading = false;
        this.modalRef = this.modalSrv.open(ModalInfoComponent, {
          modalClass: 'modal-dialog-centered',
          data: {
            messaggio:
              error.error ||
              'Si è verificato un errore durante il login. Riprova più tardi.',
          },
        });
      }
    );
  }
}
