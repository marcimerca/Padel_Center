import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authSrv: AuthService, private router: Router) {}

  login(form: NgForm) {
    this.authSrv.login(form.value).subscribe(
      () => {
        alert('Login completato!');
        this.router.navigate(['partite-del-giorno']);
      },
      (error) => {
        alert(error);
      }
    );
  }
}
