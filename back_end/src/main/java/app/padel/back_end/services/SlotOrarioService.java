package app.padel.back_end.services;

import app.padel.back_end.dto.SlotOrarioDto;
import app.padel.back_end.entities.Campo;
import app.padel.back_end.entities.SlotOrario;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.CampoRepository;
import app.padel.back_end.repositories.PrenotazioneRepository;
import app.padel.back_end.repositories.SlotOrarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class SlotOrarioService {

    @Autowired
    private SlotOrarioRepository slotOrarioRepository;

    @Autowired
    private CampoRepository campoRepository;

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    public String saveSlotOrario(SlotOrarioDto slotOrarioDto) {
        Optional<Campo> campoOptional = campoRepository.findById(slotOrarioDto.getCampoId());

        if (!campoOptional.isPresent()) {
            throw new NotFoundException("Il campo con id " + slotOrarioDto.getCampoId() + " non è stato trovato.");
        }

        LocalTime inizio = slotOrarioDto.getInizio();
        LocalTime fine = inizio.plusMinutes(90);

        List<SlotOrario> slotSovrapposti = slotOrarioRepository.findByCampoIdAndInizioLessThanAndFineGreaterThan(slotOrarioDto.getCampoId(), fine, inizio);
        if (!slotSovrapposti.isEmpty()) {
            throw new BadRequestException("E' già presente uno slot sovrapposto con l'orario di inizio: " + slotOrarioDto.getInizio());
        }

        SlotOrario slotOrario = new SlotOrario();
        slotOrario.setInizio(slotOrarioDto.getInizio());
        slotOrario.setFine(slotOrarioDto.getInizio().plusMinutes(90));
        slotOrario.setCampo(campoOptional.get());

        slotOrarioRepository.save(slotOrario);

        return "Slot orario da " + slotOrarioDto.getInizio() + " a " + slotOrarioDto.getInizio().plusMinutes(90) + " inserito correttamente.";
    }

    public List<SlotOrario> findSlotByCampo(int id) {
        return slotOrarioRepository.findByCampoId(id);
    }

    public Optional<SlotOrario> getSlotById(int id) {
        return slotOrarioRepository.findById(id);
    }


    public SlotOrario updateSlotOrario(int id, SlotOrarioDto slotOrarioDto) {
        Optional<SlotOrario> slotOrarioOptional = getSlotById(id);
        if (slotOrarioOptional.isPresent()) {
            SlotOrario slotOrario = slotOrarioOptional.get();

            LocalTime inizio = slotOrarioDto.getInizio();
            LocalTime fine = inizio.plusMinutes(90);

            List<SlotOrario> slotSovrapposti = slotOrarioRepository.findByCampoIdAndInizioLessThanAndFineGreaterThan(slotOrario.getCampo().getId(), fine, inizio);
            slotSovrapposti.removeIf(s -> s.getId() == slotOrario.getId());

            if (!slotSovrapposti.isEmpty()) {
                throw new BadRequestException("Esiste già uno slot sovrapposto con l'orario di inizio: " + slotOrarioDto.getInizio());
            }

            Optional<Campo> campoOptional = campoRepository.findById(slotOrarioDto.getCampoId());
            if (!campoOptional.isPresent()) {
                throw new NotFoundException("Il campo con id " + slotOrarioDto.getCampoId() + " non è stato trovato.");
            }

            slotOrario.setInizio(inizio);
            slotOrario.setFine(fine);
            slotOrario.setCampo(campoOptional.get());

            slotOrarioRepository.save(slotOrario);
            return slotOrario;
        } else {
            throw new NotFoundException("Lo slot orario con id " + id + " non è stato trovato");
        }
    }

    public String deleteSlotOrario(int id) {
        Optional<SlotOrario> slotOrarioOptional = slotOrarioRepository.findById(id);

        if (slotOrarioOptional.isPresent()) {
            slotOrarioRepository.deleteById(id);
            return "Slot orario con id " + id + " eliminato correttamente.";
        } else {
            throw new NotFoundException("Lo slot orario con id " + id + " non è stato trovato");
        }
    }


    @Transactional
    public String deleteSlotByCampo(Campo campo) {

        if (campo == null) {
            throw new NotFoundException("Il campo specificato non esiste");
        }

        List<SlotOrario> slotOrari = slotOrarioRepository.findByCampo(campo);
        if (slotOrari.isEmpty()) {
            throw new NotFoundException("Non ci sono slot orari associati a questo campo");
        }
        campo.getSlotOrari().forEach((s)->prenotazioneRepository.deleteBySlotOrario(s));
        slotOrarioRepository.deleteByCampo(campo);
        return "Tutti gli slot del campo sono stati eliminati";
    }


}
