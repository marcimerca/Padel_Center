package app.padel.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CampoDisponibilitaDto {

    private int id;
    private String nomeCampo;
    private List<SlotDisponibilitaDto> slotOrari;
}
