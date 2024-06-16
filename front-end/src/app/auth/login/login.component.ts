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
        alert(error);
      }
    );
  }
}
