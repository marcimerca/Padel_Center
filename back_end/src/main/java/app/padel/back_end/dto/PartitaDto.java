package app.padel.back_end.dto;

import app.padel.back_end.entities.Prenotazione;
import app.padel.back_end.entities.SlotOrario;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PartitaDto {

    @NotNull(message = "dataPartita non può essere null")
    private LocalDate dataPartita;

    @NotNull(message = "slotOrarioId non può essere null")
    private int slotOrarioId;

}
