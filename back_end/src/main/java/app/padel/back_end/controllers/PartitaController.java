package app.padel.back_end.controllers;

import app.padel.back_end.dto.CampoDto;
import app.padel.back_end.dto.PartitaDto;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.services.PartitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PartitaController {

    @Autowired
    private PartitaService partitaService;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @PostMapping("/partite")
    public String savePartita(@RequestBody @Validated PartitaDto partitaDto, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return partitaService.savePartita(partitaDto);
    }
}
