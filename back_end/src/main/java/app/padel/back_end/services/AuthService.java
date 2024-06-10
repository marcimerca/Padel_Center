package app.padel.back_end.services;

import app.padel.back_end.dto.AuthDataDto;
import app.padel.back_end.dto.UserLoginDto;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.exceptions.UnauthorizedException;
import app.padel.back_end.security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    public UserService userService;


    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthDataDto authenticateUserAndCreateToken(UserLoginDto userLoginDto) {
        Optional<User> userOptional = userService.getUserByEmail(userLoginDto.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
                //jwtTool.createToken(utente);
                AuthDataDto authDataDto = new AuthDataDto();
                authDataDto.setAccessToken(jwtTool.createToken(user));
                authDataDto.setRuolo(user.getRuolo());
                authDataDto.setNome(user.getNome());
                authDataDto.setCognome(user.getCognome());
                authDataDto.setEmail(user.getEmail());
                authDataDto.setUsername(user.getUsername());
                authDataDto.setId(user.getId());
                authDataDto.setAvatar(user.getAvatar());
                return authDataDto;

            } else {
                throw new UnauthorizedException("Errore nel login, riloggarsi");
            }

        } else {
            throw new NotFoundException(" L'utente con email " + userLoginDto.getEmail() + "non è stato trovato");
        }
    }
}

