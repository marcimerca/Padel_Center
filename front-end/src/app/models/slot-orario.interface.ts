import { Campo } from './campo.interface';
import { Partita } from './partita.interface';

export interface SlotOrario {
  id: number;
  inizio: string; // Assuming ISO string format for time
  fine: string; // Assuming ISO string format for time
  campo: Campo;
  partite: Partita[];
}
