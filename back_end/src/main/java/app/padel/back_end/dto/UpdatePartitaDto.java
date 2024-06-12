package app.padel.back_end.dto;

import app.padel.back_end.entities.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class UpdatePartitaDto {

    @NotNull(message = "partitaDto non può essere null")
    private PartitaDto partitaDto;

    private List<User> nuoviUtenti;

   private boolean aggiungiUtente;


}
