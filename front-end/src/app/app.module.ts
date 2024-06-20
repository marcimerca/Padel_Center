import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthGuard } from './auth/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PartiteDelGiornoComponent } from './components/partite-del-giorno/partite-del-giorno.component';

import { ProfiloUtenteComponent } from './components/profilo-utente/profilo-utente.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';

import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

import { ModalConfermaComponent } from './components/modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { PrenotazioneComponent } from './components/prenotazione/prenotazione.component';

const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'partite-del-giorno',
    component: PartiteDelGiornoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profilo-utente',
    component: ProfiloUtenteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prenotazione',
    component: PrenotazioneComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    PartiteDelGiornoComponent,
    ProfiloUtenteComponent,
    CapitalizeFirstPipe,
    PrenotazioneComponent,

    ModalConfermaComponent,
    ModalInfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MdbModalModule,
    MdbCarouselModule,
    MdbTooltipModule,
    MdbValidationModule,
    MdbFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
