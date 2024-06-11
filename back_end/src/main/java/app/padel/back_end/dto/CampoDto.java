package app.padel.back_end.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CampoDto {
    @NotBlank(message = "nomeCampo non può essere null, vuoto, o composto da soli spazi")
    private String nomeCampo;

}
