import { Partita } from './partita.interface';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  nome: string;
  cognome: string;
  avatar: string;
  ruolo: string;
  partitePrenotate: Partita[];
}
