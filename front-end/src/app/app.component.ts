import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuthData } from './models/auth-data.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front-end';
  user!: AuthData | null;

  constructor(private authSrv: AuthService) {}
  ngOnInit(): void {
    this.authSrv.restore();
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
