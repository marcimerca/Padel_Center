package app.padel.back_end.dto;

import app.padel.back_end.entities.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpdatePartita {

    @NotNull(message = "partitaDto non può essere null")
    private PrenotazioneDto prenotazioneDto;

    private List<User> nuoviUtenti;

    public boolean isAggiungiUtente;
}
