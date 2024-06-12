package app.padel.back_end.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PartitaDto {

    @NotNull(message = "dataPartita non può essere null")
    private LocalDate dataPartita;

    @NotNull(message = "slotOrarioId non può essere null")
    private int slotOrarioId;

}
