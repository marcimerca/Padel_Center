/*
package app.padel.back_end.controllers;

import app.padel.back_end.dto.PrenotazioneDto;
import app.padel.back_end.dto.UpdatePartita;
import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.services.PartitaService;
import app.padel.back_end.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/partite")
public class PartitaController {

    @Autowired
    private PartitaService partitaService;

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @PostMapping
    public String savePartita(@RequestBody @Validated PrenotazioneDto prenotazioneDto, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return partitaService.savePartita(prenotazioneDto);
    }



    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public List<Partita> getAllPartite(){
        return partitaService.getAllPartite();
    }


    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @GetMapping("/per-data")
    public List<Partita> findPartiteByData(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return partitaService.findPartiteByData(data);
    }

    @GetMapping("/by-user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Partita> findPartiteByUserId(@PathVariable("userId") int userId){
       Optional<User> userOptional = userService.getUserById(userId);
       if(userOptional.isPresent()){
           return partitaService.findPartiteByUser(userOptional.get());
       } else{
           throw new NotFoundException("L'utente con id " + userOptional.get().getId() + " non è stato trovato.");
       }

    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<Partita> findPartiteByLoggedUser(){
        return partitaService.findPartiteByLoggedUser();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Partita getPartitaById(@PathVariable int id) {
        Optional<Partita> partitaOptional = partitaService.findPartitaById(id);

        if (partitaOptional.isPresent()) {
            return partitaOptional.get();
        } else {
            throw new NotFoundException("La partita con id " + id + " non è stata trovata");
        }
    }


   @PreAuthorize("hasAuthority('ADMIN')")
    @PatchMapping("/{id}")
    public Partita updatePartita(@PathVariable int id, @RequestBody @Validated UpdatePartita update, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        Partita updatedPartita = partitaService.updatePartita(id, update);
        return updatedPartita;
    }


    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @DeleteMapping("/{id}")
    public String annullaPrenotazione(@PathVariable("id") int partitaId) {
        return partitaService.annullaPrenotazione(partitaId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("delete/{id}")
    public String eliminaPartita(@PathVariable("id") int partitaId) {
        return partitaService.deletePartita(partitaId);
    }
}
*/
