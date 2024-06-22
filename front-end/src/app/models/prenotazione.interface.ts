import { SlotOrario } from './slot-orario.interface';

export interface Prenotazione {
  id?: number;
  slotOrario: SlotOrario;
  dataPrenotazione: string;
}
