package app.padel.back_end.controllers;

import app.padel.back_end.dto.AuthDataDto;
import app.padel.back_end.dto.UserDto;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public User getUserById(@PathVariable int id) {
        Optional<User> utenteOptional = userService.getUserById(id);

        if (utenteOptional.isPresent()) {
            return utenteOptional.get();
        } else {
            throw new NotFoundException("L' utente con id " + id + " non è stato trovato.");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateUserByAdmin(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) throws IOException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return userService.updateUserByAdmin(id, userDto);
    }

    @PutMapping(value = "/update", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public AuthDataDto updateUser(
            @RequestParam("id") Integer id,
            @RequestParam("username") String username,
            @RequestParam("nome") String nome,
            @RequestParam("cognome") String cognome,
            @RequestParam("email") String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) throws IOException {

        if (avatar != null && !avatar.getContentType().startsWith("image/")) {
           throw new BadRequestException("Solo immagini sono consentite.");
        }
        if (avatar != null && avatar.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Il file è troppo grande. La dimensione massima consentita è di 5MB.");
        }
        UserDto userDto = new UserDto();
        userDto.setUsername(username);
        userDto.setNome(nome);
        userDto.setCognome(cognome);
        userDto.setEmail(email);
        userDto.setPassword(password);
        userDto.setAvatar(avatar);

       return userService.updateUser(userDto);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }


    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.existsByEmail(email);
    }

    @GetMapping("/check-username")
    public boolean checkUsernameExists(@RequestParam String username) {
        return userService.existsByUsername(username);
    }

    @PatchMapping("/carica-foto")
    public String patchFotoUser( @RequestBody MultipartFile avatar) throws IOException {
        return userService.patchAvatarUtente(avatar);
    }
}
