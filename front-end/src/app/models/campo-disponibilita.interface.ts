import { SlotDisponibilita } from './slot-disponibilita.interface';

export interface CampoDisponibilita {
  id?: number;
  nomeCampo: string;
  slotOrari: SlotDisponibilita[];
}
