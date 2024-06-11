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

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody @Validated UserDto userDto, BindingResult bindingResult) {


        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

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
