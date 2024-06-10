package app.padel.back_end.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDto {


    @NotBlank(message = "username non può essere null, vuoto, o composto da soli spazi")
    @Size(min = 5,max = 10, message = "username deve avere tra 5 e 10 caratteri")
    private String username;

    @NotNull

    @NotBlank(message = "email non può essere null, vuota, o composto da soli spazi")
    private String email;

    @NotBlank(message = "password non può essere null, vuota, o composta da soli spazi")
    private String password;

    @NotBlank(message = "nome non può essere null, vuoto, o composto da soli spazi")
    private String nome;


    @NotBlank(message = "cognome non può essere null, vuoto, o composto da soli spazi")
    private String cognome;

    private String avatar;

}
