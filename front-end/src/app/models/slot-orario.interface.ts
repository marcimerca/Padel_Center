import { Campo } from './campo.interface';
import { Partita } from './partita.interface';

export interface SlotOrario {
  id: number;
  inizio: string;
  fine: string;
  campo: Campo;
  partite: Partita[];
}
