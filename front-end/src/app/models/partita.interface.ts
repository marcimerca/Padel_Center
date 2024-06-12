import { SlotOrario } from './slot-orario.interface';
import { User } from './user.interface';
export interface Partita {
  id?: number;
  numMaxGiocatori: number;
  numGiocatoriAttuali: number;
  dataPartita: string;
  utentiPrenotati: User[];
  slotOrario: SlotOrario;
}
