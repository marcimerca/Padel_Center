package app.padel.back_end.controllers;

import app.padel.back_end.dto.CampoDisponibilitaDto;
import app.padel.back_end.dto.CampoDto;
import app.padel.back_end.entities.Campo;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.services.CampoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/campi")
public class CampoController {

    @Autowired
    private CampoService campoService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public String saveCampo(@RequestBody @Validated CampoDto campoDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return campoService.saveCampo(campoDto);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<Campo> getAllCampi() {
        return campoService.getAllCampi();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Campo getCampoById(@PathVariable int id) {
        Optional<Campo> campoOptional = campoService.getCampoById(id);

        if (campoOptional.isPresent()) {
            return campoOptional.get();
        } else {
            throw new NotFoundException("Il campo con id " + id + "non è stato trovato");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Campo updateCampo(@PathVariable int id, @RequestBody @Validated CampoDto campoDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return campoService.updateCampo(id, campoDto);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteCampo(@PathVariable int id) {
        return campoService.deleteCampo(id);
    }

    @GetMapping("/disponibilita/{data}")
    public List<CampoDisponibilitaDto> getCampiConDisponibilita(@PathVariable("data") LocalDate data) {
        return campoService.getCampiConDisponibilita(data);
    }
}
