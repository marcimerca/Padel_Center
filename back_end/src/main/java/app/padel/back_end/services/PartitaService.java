package app.padel.back_end.services;

import app.padel.back_end.dto.PartitaDto;
import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.SlotOrario;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.PartitaRepository;
import app.padel.back_end.repositories.SlotOrarioRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PartitaService {

    @Autowired
    private PartitaRepository partitaRepository;

    @Autowired
    private SlotOrarioRepository slotOrarioRepository;


    public String savePartita(PartitaDto partitaDto) {

        Optional<SlotOrario> slotOrarioOptional = (slotOrarioRepository.findById(partitaDto.getSlotOrarioId()));

        if (slotOrarioOptional.isPresent()) {
            SlotOrario slotOrario = slotOrarioOptional.get();
            Optional<Partita> partitaOptional = partitaRepository.findByDataPartitaAndSlotOrario(partitaDto.getDataPartita(), slotOrario);

            User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (partitaOptional.isPresent()) {
                Partita partitaEsistente = partitaOptional.get();

                if (partitaEsistente.getNumGiocatoriAttuali() >= partitaEsistente.getNumMaxGiocatori()) {
                    throw new BadRequestException("La partita per la data " + partitaDto.getDataPartita() + " e lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + " ha già raggiunto il numero massimo di giocatori.");
                }
                if (partitaEsistente.getUtentiPrenotati().contains(loggedUser)) {
                    throw new BadRequestException("Sei già prenotato per questa partita.");
                } else {
                    partitaEsistente.getUtentiPrenotati().add(loggedUser);
                    partitaEsistente.setNumGiocatoriAttuali(partitaEsistente.getNumGiocatoriAttuali() + 1);
                    partitaRepository.save(partitaEsistente);
                    return "Sei stato aggiunto con successo alla partita per la data " + partitaDto.getDataPartita() + " e lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + ".";
                }

            } else {
                Partita partita = new Partita();
                partita.setDataPartita(partitaDto.getDataPartita());
                partita.setSlotOrario(slotOrario);
                partita.setDataPartita(partitaDto.getDataPartita());
                partita.getUtentiPrenotati().add(loggedUser);
                partita.setNumGiocatoriAttuali(1);
                partitaRepository.save(partita);
                return "Partita per la data " + partitaDto.getDataPartita() + " per lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + " salvata con successo.";
            }

        } else {
            throw new NotFoundException("Slot orario non presente");
        }
    }
}

