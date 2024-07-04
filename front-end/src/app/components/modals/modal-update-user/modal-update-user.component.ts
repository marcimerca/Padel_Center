import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';

@Component({
  selector: 'app-modal-update-user',
  templateUrl: './modal-update-user.component.html',
  styleUrls: ['./modal-update-user.component.scss'],
})
export class ModalUpdateUserComponent {
  updateForm!: FormGroup;
  avatarFile: File | null = null;
  fileError: string | null = null;

  @Input() user!: AuthData;
  @Output() onClose = new EventEmitter<AuthData>();

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    public modalRef: MdbModalRef<ModalUpdateUserComponent>
  ) {}

  ngOnInit() {
    this.updateForm = this.fb.group({
      username: [this.user.username, [Validators.minLength(5)]],
      nome: [this.user.nome],
      cognome: [this.user.cognome],
      email: [this.user.email, [Validators.email]],
      password: [
        null,
        [
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

  update() {
    if (this.updateForm.valid && !this.fileError) {
      const emailControl = this.updateForm.get('email');
      const email = emailControl?.value;

      const usernameControl = this.updateForm.get('username');
      const username = usernameControl?.value;

      this.authSrv
        .checkEmailEsistente(email)
        .subscribe((emailExists: boolean) => {
          if (emailExists && email !== this.user.email) {
            emailControl?.setErrors({ alreadyExists: true });
          } else {
            this.authSrv
              .checkUsernameEsistente(username)
              .subscribe((usernameExists: boolean) => {
                if (usernameExists && username !== this.user.username) {
                  usernameControl?.setErrors({ alreadyExists: true });
                } else {
                  const formData = new FormData();
                  formData.append('id', this.user.id.toString());
                  formData.append(
                    'username',
                    this.updateForm.get('username')?.value
                  );
                  formData.append('nome', this.updateForm.get('nome')?.value);
                  formData.append(
                    'cognome',
                    this.updateForm.get('cognome')?.value
                  );
                  formData.append('email', this.updateForm.get('email')?.value);
                  if (this.updateForm.get('password')?.value) {
                    formData.append(
                      'password',
                      this.updateForm.get('password')?.value
                    );
                  }
                  if (this.avatarFile) {
                    formData.append('avatar', this.avatarFile);
                  }

                  this.authSrv.updateUser(formData).subscribe(
                    (updatedUser) => {
                      this.modalRef.close(updatedUser);
                      this.onClose.emit(updatedUser);
                    },
                    (error) => {
                      this.updateForm.get('password')?.setValue('');
                    }
                  );
                }
              });
          }
        });
    }
  }

  getErrorsControl(name: string, error: string) {
    return this.updateForm.get(name)?.errors![error];
  }

  getFormControl(name: string) {
    return this.updateForm.get(name);
  }

  annulla() {
    this.modalRef.close(null);
    this.onClose.emit();
  }
}
