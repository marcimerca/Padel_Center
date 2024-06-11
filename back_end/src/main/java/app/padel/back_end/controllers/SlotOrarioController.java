package app.padel.back_end.controllers;

import app.padel.back_end.dto.CampoDto;
import app.padel.back_end.dto.SlotOrarioDto;
import app.padel.back_end.entities.Campo;
import app.padel.back_end.entities.SlotOrario;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.services.SlotOrarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class SlotOrarioController {

    @Autowired
    private SlotOrarioService slotOrarioService;


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/slot-orari")
    public String saveSlotOrario(@RequestBody @Validated SlotOrarioDto slotOrarioDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return slotOrarioService.saveSlotOrario(slotOrarioDto);
    }

    @GetMapping("/campi/{campoId}/slot-orari")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<SlotOrario> getAllSlotOrariByCampo( @PathVariable int campoId) {
        return slotOrarioService.findSlotByCampo(campoId);
    }

    @GetMapping("/slot-orari/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public SlotOrario getSlotOrarioById(@PathVariable int id) {
        Optional<SlotOrario> slotOrarioOptional = slotOrarioService.getSlotById(id);

        if (slotOrarioOptional.isPresent()) {
            return slotOrarioOptional.get();
        } else {
            throw new NotFoundException("Lo slot orario con id " + id + " non è stato trovato");
        }
    }

    @PutMapping("/campi/slot-orari/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public SlotOrario updateSlotOrario(@PathVariable int id, @RequestBody @Validated SlotOrarioDto slotOrarioDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error -> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }

        return slotOrarioService.updateSlotOrario(id,slotOrarioDto);
    }

    @DeleteMapping("/slot-orari/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteSlotOrario(@PathVariable int id) {
        return slotOrarioService.deleteSlotOrario(id);
    }
}
