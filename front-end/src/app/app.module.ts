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
import { AdminGuard } from './auth/admin.guard';

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

import { ModalConfermaComponent } from './components/modals/modal-conferma/modal-conferma.component';
import { ModalInfoComponent } from './components/modals/modal-info/modal-info.component';
import { PrenotazioneComponent } from './components/prenotazione/prenotazione.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ModalPrenotazioneAdminComponent } from './components/modals/modal-prenotazione-admin/modal-prenotazione-admin.component';
import { GestioneDisponibilitaAdminComponent } from './components/gestione-disponibilita-admin/gestione-disponibilita-admin.component';
import { GestioneCampiAdminComponent } from './components/gestione-campi-admin/gestione-campi-admin.component';
import { ModalCreazioneCampoAdminComponent } from './components/modals/modal-creazione-campo-admin/modal-creazione-campo-admin.component';
import { ModalAggiuntaSlotAdminComponent } from './components/modals/modal-aggiunta-slot-admin/modal-aggiunta-slot-admin.component';
import { GestionePartiteAdminComponent } from './components/gestione-partite-admin/gestione-partite-admin.component';
import { UsersComponent } from './components/users/users.component';
import { FilterUsers } from './pipes/filter-users.pipe';
import { ModalAggiungiVincitoriComponent } from './components/modals/modal-aggiungi-vincitori/modal-aggiungi-vincitori.component';
import { ModalAggiungiVincitoriAdminComponent } from './components/modals/modal-aggiungi-vincitori-admin/modal-aggiungi-vincitori-admin.component';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { ModalUpdateUserComponent } from './components/modals/modal-update-user/modal-update-user.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
    path: 'users/:id',
    component: ProfiloUtenteComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'prenotazione',
    component: PrenotazioneComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'gestione-disponibilita',
        pathMatch: 'full',
      },
      {
        path: 'gestione-disponibilita',
        component: GestioneDisponibilitaAdminComponent,
      },
      {
        path: 'gestione-campi',
        component: GestioneCampiAdminComponent,
      },
      {
        path: 'gestione-partite',
        component: GestionePartiteAdminComponent,
      },
      {
        path: 'gestione-users',
        component: UsersComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
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
    AdminDashboardComponent,

    ModalConfermaComponent,
    ModalInfoComponent,
    ModalPrenotazioneAdminComponent,
    GestioneDisponibilitaAdminComponent,
    GestioneCampiAdminComponent,
    ModalCreazioneCampoAdminComponent,
    ModalAggiuntaSlotAdminComponent,
    GestionePartiteAdminComponent,
    UsersComponent,
    FilterUsers,
    ModalAggiungiVincitoriComponent,
    ModalAggiungiVincitoriAdminComponent,
    EllipsisPipe,
    ModalUpdateUserComponent,
    FooterComponent,
    NotFoundComponent,
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
