package app.padel.back_end.dto;

import app.padel.back_end.entities.Campo;
import app.padel.back_end.entities.Partita;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class SlotOrarioDto {

 /*   @NotNull(message = "inizio non può essere null")*/
    private LocalTime inizio;

    @NotNull(message = "campoId non può essere null")
    private int campoId;



}
