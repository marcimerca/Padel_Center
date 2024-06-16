import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user!: AuthData | null;
  constructor(private authSrv: AuthService) {}
  ngOnInit() {
    this.authSrv.user$.subscribe((user) => (this.user = user));
  }

  logout() {
    this.authSrv.logout();
  }
}
