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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router
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
        Validators.minLength(8),
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
        // Se l'email esiste già, aggiungi l'errore direttamente al campo email
        emailControl?.setErrors({ alreadyExists: true });
      } else {
        // Se l'email non esiste, procedi con la registrazione
        this.authSrv.register(form.value).subscribe(
          () => {
            alert('Registration completed!');
            this.router.navigate(['/login']);
          },
          (error) => {
            this.registerForm.get('password')?.setValue('');
          }
        );
      }
    });
  }
}
