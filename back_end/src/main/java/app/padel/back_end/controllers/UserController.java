package app.padel.back_end.controllers;

import app.padel.back_end.dto.UserDto;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    public User updateUserByAdmin(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return userService.updateUserByAdmin(id, userDto);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public User updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return userService.updateUser(id, userDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }


    @GetMapping("/check-email")
    public boolean checkEmailExists(@RequestParam String email) {
        return userService.existsByEmail(email);
    }

}
