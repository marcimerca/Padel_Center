import { Prenotazione } from './prenotazione.interface';
import { User } from './user.interface';
export interface Partita extends Prenotazione {
  numMaxGiocatori: number;
  numGiocatoriAttuali: number;
  utentiPrenotati: User[];
}
