package app.padel.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class SlotDisponibilitaDto {

    private LocalTime inizio;
    private LocalTime fine;
    private boolean occupato;


}
