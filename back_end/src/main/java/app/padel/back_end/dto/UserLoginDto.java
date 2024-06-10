package app.padel.back_end.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDto {

    @Email
    @NotBlank(message = "l'email non puo essere vuota o mancante o composta da soli spazi")
    private String email;

    @NotBlank(message = "La password non puo essere vuota o mancante o composta da soli spazi")
    private String password;
}
