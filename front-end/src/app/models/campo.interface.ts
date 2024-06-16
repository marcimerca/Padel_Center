import { SlotOrario } from './slot-orario.interface';

export interface Campo {
  id: number;
  nomeCampo: string;
  slotOrari: SlotOrario[];
}
