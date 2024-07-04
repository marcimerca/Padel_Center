package app.padel.back_end.controllers;

import app.padel.back_end.dto.AuthDataDto;
import app.padel.back_end.dto.UserDto;
import app.padel.back_end.dto.UserLoginDto;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.services.AuthService;
import app.padel.back_end.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;



    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public String registerUser(
            @RequestParam("username") String username,
            @RequestParam("nome") String nome,
            @RequestParam("cognome") String cognome,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) throws IOException {


        UserDto userDto = new UserDto();
        userDto.setUsername(username);
        userDto.setNome(nome);
        userDto.setCognome(cognome);
        userDto.setEmail(email);
        userDto.setPassword(password);
        userDto.setAvatar(avatar);

        return userService.saveUser(userDto);
    }

    @PostMapping("/login")
    public AuthDataDto login(@RequestBody @Validated UserLoginDto userLoginDTO, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return authService.authenticateUserAndCreateToken(userLoginDTO);
    }
}
