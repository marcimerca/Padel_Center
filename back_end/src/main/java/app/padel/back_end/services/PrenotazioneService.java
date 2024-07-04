package app.padel.back_end.services;

import app.padel.back_end.dto.PrenotazioneDto;
import app.padel.back_end.dto.UpdatePartita;
import app.padel.back_end.entities.*;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.PartitaRepository;
import app.padel.back_end.repositories.PrenotazioneRepository;
import app.padel.back_end.repositories.SlotOrarioRepository;
import app.padel.back_end.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrenotazioneService {


    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private PartitaRepository partitaRepository;

    @Autowired
    private SlotOrarioRepository slotOrarioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSenderImpl javaMailSender;


    public String savePartita(PrenotazioneDto prenotazioneDto) {
        Optional<SlotOrario> slotOrarioOptional = slotOrarioRepository.findById(prenotazioneDto.getSlotOrarioId());

        if (slotOrarioOptional.isEmpty()) {
            throw new NotFoundException("Slot orario non presente");
        }

        SlotOrario slotOrario = slotOrarioOptional.get();

        // Verifica se la data e l'orario della partita sono già passati
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime partitaDateTime = prenotazioneDto.getDataPrenotazione().atTime(slotOrario.getInizio());

        if (partitaDateTime.isBefore(now)) {
            throw new BadRequestException("Non è possibile aggiungersi a una partita passata.");
        }

        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        List<Partita> partiteUtente = partitaRepository.findByUtentiPrenotati(loggedUser);


        List<Partita> partiteNellaData = partiteUtente.stream()
                .filter(p -> p.getDataPrenotazione().equals(prenotazioneDto.getDataPrenotazione()))
                .collect(Collectors.toList());


        for (Partita p : partiteNellaData) {
            SlotOrario s = p.getSlotOrario();
            boolean sovrapposizione = (slotOrario.getInizio().isBefore(s.getFine()) && slotOrario.getFine().isAfter(s.getInizio()));
            if (sovrapposizione) {
                throw new BadRequestException("Hai già una partita che si sovrappone a questo slot orario nella stessa data.");
            }
        }

        Optional<Prenotazione> partitaOptional = prenotazioneRepository.findByDataPrenotazioneAndSlotOrario(prenotazioneDto.getDataPrenotazione(), slotOrario);

        if (partitaOptional.isPresent()) {
            Partita partitaEsistente = (Partita) partitaOptional.get();

            if (partitaEsistente.getNumGiocatoriAttuali() >= partitaEsistente.getNumMaxGiocatori()) {
                throw new BadRequestException("La partita per la data " + prenotazioneDto.getDataPrenotazione() + " e lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + " ha già raggiunto il numero massimo di giocatori.");
            }
            if (partitaEsistente.getUtentiPrenotati().contains(loggedUser)) {
                throw new BadRequestException("Sei già prenotato per questa partita.");
            } else {
                partitaEsistente.getUtentiPrenotati().add(loggedUser);
                partitaEsistente.setNumGiocatoriAttuali(partitaEsistente.getNumGiocatoriAttuali() + 1);
                prenotazioneRepository.save(partitaEsistente);
                return "Sei stato aggiunto con successo alla partita per la data " + prenotazioneDto.getDataPrenotazione() + " e lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + ".";
            }

        } else {
            Partita partita = new Partita();
            partita.setDataPrenotazione(prenotazioneDto.getDataPrenotazione());
            partita.setSlotOrario(slotOrario);
            partita.getUtentiPrenotati().add(loggedUser);
            partita.setNumGiocatoriAttuali(1);
            partita.setMotivoPrenotazione("partita");
            partita.getSlotOrario().setMotivoPrenotazione("partita");
           prenotazioneRepository.save(partita);
            return "Partita per la data " + prenotazioneDto.getDataPrenotazione() + " per lo slot dalle " + slotOrario.getInizio() + " alle " + slotOrario.getFine() + " salvata con successo.";
        }
    }

    public boolean verificaSlotOrarioDisponibile(SlotOrario slotOrario, LocalDate dataPartita) {
        Optional<Prenotazione> partitaOptional =  prenotazioneRepository.findByDataPrenotazioneAndSlotOrario(dataPartita, slotOrario);

        return partitaOptional.isEmpty();
    }

    public List<Partita> getAllPartite() {
        return partitaRepository.findAll();
    }

    public List<Partita> findPartiteByData(LocalDate data) {
        return prenotazioneRepository.findByDataPrenotazione(data);
    }

    public List<Partita> findPartiteByUser(User user) {
        return prenotazioneRepository.findByUtentiPrenotati(user);
    }

    public List<Partita> findPartiteByLoggedUser() {
        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return prenotazioneRepository.findByUtentiPrenotati(loggedUser);
    }

    public Optional<Partita> findPartitaById(int id) {
        return partitaRepository.findById(id);
    }


    public String annullaPrenotazione(int id) {
        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Partita> partitaOptional = partitaRepository.findById(id);

        if (partitaOptional.isPresent()) {
            Partita partita = partitaOptional.get();
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime dataPartita = LocalDateTime.of(partita.getDataPrenotazione(), partita.getSlotOrario().getInizio());

            if (dataPartita.isBefore(now)) {
                throw new BadRequestException("Impossibile annullare una partita che è già stata giocata.");
            }

            if (partita.getUtentiPrenotati().contains(loggedUser)) {
                if (partita.getUtentiPrenotati().size() >= 2) {
                    partita.setNumGiocatoriAttuali(partita.getNumGiocatoriAttuali() - 1);
                    partita.getUtentiPrenotati().remove(loggedUser);
                    prenotazioneRepository.save(partita);
                    return "La prenotazione per l'utente " + loggedUser.getUsername() + " è stata annullata con successo.";
                } else if (ChronoUnit.HOURS.between(now, dataPartita) > 24) {
                    prenotazioneRepository.delete(partita);
                    return "La partita è stata cancellata con successo.";
                } else {
                    throw new BadRequestException("Impossibile annullare la partita, contattare il circolo.");
                }
            } else {
                throw new BadRequestException("Non sei prenotato per questa partita.");
            }
        } else {
            throw new NotFoundException("La partita con id " + id + " non è stata trovata");
        }
    }



    public Optional<Prenotazione> findPrenotazioneBySlotOrarioAndDataPrenotazione(int slotId, LocalDate dataPrenotazione) {
        Optional<SlotOrario> slotOrarioOptional = slotOrarioRepository.findById(slotId);
       if(slotOrarioOptional.isPresent()){
           return prenotazioneRepository.findByDataPrenotazioneAndSlotOrario(dataPrenotazione, slotOrarioOptional.get());
       } else {
           throw new NotFoundException("La prenotazione non è stata trovata");
       }

    }

    public String deletePartita(int id) {
        Optional<Partita> partitaOptional = findPartitaById(id);
        if (partitaOptional.isPresent()) {
            prenotazioneRepository.delete(partitaOptional.get());
            return "Partita " + " eliminata correttamente.";
        } else {
            throw new NotFoundException("La partita con id " + id + "non è stata trovata");
        }

    }


    public Partita bloccaESbloccaPartita(int idPartita) {
        Optional<Partita> partitaOptional = partitaRepository.findById(idPartita);

        if (partitaOptional.isPresent()) {
            Partita partita = partitaOptional.get();

            if (partita.getNumGiocatoriAttuali() == partita.getNumMaxGiocatori()) {
                partita.setNumGiocatoriAttuali(partita.getUtentiPrenotati().size());
                partitaRepository.save(partita);
               return partita;
            } else {
                partita.setNumGiocatoriAttuali(partita.getNumMaxGiocatori());
                partitaRepository.save(partita);
                return partita;
            }
        } else {
            throw new NotFoundException("La partita con id " + idPartita + " non è stata trovata");
        }
    }


    public Partita updatePartita(int id, UpdatePartita updatePartitaDto) {
        Optional<Partita> partitaOptional = findPartitaById(id);

        if (partitaOptional.isPresent()) {
            Partita partita = partitaOptional.get();

            if (updatePartitaDto.getPrenotazioneDto().getDataPrenotazione().isBefore(LocalDate.now())) {
                throw new BadRequestException("Impossibile modificare una partita con data nel passato.");
            }


            if (partita.getNumGiocatoriAttuali() + updatePartitaDto.getNuoviUtenti().size() > partita.getNumMaxGiocatori()) {
                throw new BadRequestException("La partita ha già raggiunto il numero massimo di giocatori.");
            }

            List<User> utentiAttuali = partita.getUtentiPrenotati();
            for (User nuovoUtente : updatePartitaDto.getNuoviUtenti()) {
                if (updatePartitaDto.isAggiungiUtente()) {

                    if (!utentiAttuali.contains(nuovoUtente)) {
                        utentiAttuali.add(nuovoUtente);
                    } else {
                        throw new BadRequestException("La partita ha già il giocatore " + nuovoUtente.getUsername());
                    }
                } else {
                    // Rimuovi l'utente solo se è presente nella lista
                    if (utentiAttuali.contains(nuovoUtente)) {
                        utentiAttuali.remove(nuovoUtente);
                    } else {
                        throw new BadRequestException("L'utente " + nuovoUtente.getUsername() + " non è presente nella partita.");
                    }
                }
            }

            partita.setNumGiocatoriAttuali(utentiAttuali.size());
            return prenotazioneRepository.save(partita);
        } else {
            throw new NotFoundException("La partita con id " + id + " non è stata trovata.");
        }
    }

    //--------------------------\\
    //prenotazione admin

    public PrenotazioneAdmin savePrenotazioneAdmin(PrenotazioneDto prenotazioneDto) {

        PrenotazioneAdmin prenotazioneAdmin = new PrenotazioneAdmin();
        prenotazioneAdmin.setMotivoPrenotazione(prenotazioneDto.getMotivoPrenotazione());
        prenotazioneAdmin.setDataPrenotazione(prenotazioneDto.getDataPrenotazione());
        prenotazioneAdmin.setSlotOrario(slotOrarioRepository.findById(prenotazioneDto.getSlotOrarioId()).get());
        prenotazioneAdmin.getSlotOrario().setMotivoPrenotazione(prenotazioneDto.getMotivoPrenotazione());

        PrenotazioneAdmin savedPrenotazioneAdmin = prenotazioneRepository.save(prenotazioneAdmin);
        return prenotazioneAdmin;
    }

    public String annullaPrenotazioneAdmin(int id) {
        Optional<Prenotazione> prenotazioneAdminOptional = prenotazioneRepository.findById(id);

        if (prenotazioneAdminOptional.isPresent()) {
            Prenotazione prenotazioneAdmin =  prenotazioneAdminOptional.get();

            prenotazioneRepository.delete(prenotazioneAdmin);
            return "La prenotazione amministrativa è stata annullata con successo.";
        } else {
            throw new NotFoundException("La prenotazione amministrativa con id " + id + " non è stata trovata.");
        }
    }

    public String annullaPrenotazionePartitaAdmin(int idPartita, int userId) {
        Optional<Partita> partitaOptional = partitaRepository.findById(idPartita);
        if (partitaOptional.isPresent()) {
            Partita partita = partitaOptional.get();
            Optional<User> userOptional = userRepository.findById(userId);

            if(userOptional.isPresent()){
                partita.setNumGiocatoriAttuali(partita.getNumGiocatoriAttuali() - 1);
                if(partita.getUtentiPrenotati().isEmpty()){
                    prenotazioneRepository.delete(partita);
                    return "Utente rimosso e partita eliminata correttamente";
                } else {
                    partita.getUtentiPrenotati().remove(userOptional.get());
                    prenotazioneRepository.save(partita);
                    return "Utente rimosso correttamente dalla partita";
                }

            } else {
                return "Utente con id " + userId + "non è stato trovato";
            }

        } else {
            throw new NotFoundException("La partita con id " + idPartita + " non è stata trovata");
        }
    }

/*parte vincitori*/




    @Transactional
    public Partita aggiungiVincitoriAllaPartita(int partitaId, User compagno, String tipoRisultato) {

        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Prenotazione> partitaOptional = prenotazioneRepository.findById(partitaId);

        if (!partitaOptional.isPresent()) {
            throw new NotFoundException("Partita con ID " + partitaId + " non trovata.");
        }

        Partita partita = (Partita) partitaOptional.get();


        if ("vittoria".equals(tipoRisultato)) {

            partita.getGiocatoriVincenti().removeAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().add(loggedUser);
            partita.getGiocatoriVincenti().add(compagno);
        } else if ("sconfitta".equals(tipoRisultato)) {

            partita.getGiocatoriVincenti().removeAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().addAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().remove(loggedUser);
            partita.getGiocatoriVincenti().remove(compagno);
        } else {
            throw new IllegalArgumentException("Tipo di risultato non supportato: " + tipoRisultato);
        }

        prenotazioneRepository.save(partita);


        String subject = "Registrazione risultato";
        String text = "Registrazione risultato avvenuta con successo: La partita del " + partita.getDataPrenotazione() +
                " (" + partita.getSlotOrario().getInizio() + " - " + partita.getSlotOrario().getFine() + ") è stata vinta da " +
                partita.getGiocatoriVincenti().get(0).getNome()+ " " + partita.getGiocatoriVincenti().get(0).getCognome() + " e " +
                partita.getGiocatoriVincenti().get(1).getNome() + " " + partita.getGiocatoriVincenti().get(1).getCognome();

        partita.getUtentiPrenotati().forEach(user -> {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject(subject);
            message.setText(text);
            sendEmail(message);
        });

        return partita;
    }

    @Transactional
    public Partita aggiungiVincitoriAllaPartitaAdmin(int partitaId, List<User> compagni, String tipoRisultato) {

        Optional<Prenotazione> partitaOptional = prenotazioneRepository.findById(partitaId);

        if (!partitaOptional.isPresent()) {
            throw new NotFoundException("Partita con ID " + partitaId + " non trovata.");
        }

        Partita partita = (Partita) partitaOptional.get();


        if ("vittoria".equals(tipoRisultato)) {

            partita.getGiocatoriVincenti().removeAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().addAll(compagni);



        } else if ("sconfitta".equals(tipoRisultato)) {

            partita.getGiocatoriVincenti().removeAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().addAll(partita.getUtentiPrenotati());
            partita.getGiocatoriVincenti().removeAll(compagni);

        } else {
            throw new IllegalArgumentException("Tipo di risultato non supportato: " + tipoRisultato);
        }

        prenotazioneRepository.save(partita);


        String subject = "Registrazione risultato";
        String text = "Registrazione risultato avvenuta con successo: La partita del " + partita.getDataPrenotazione() +
                " (" + partita.getSlotOrario().getInizio() + " - " + partita.getSlotOrario().getFine() + ") è stata vinta da " +
                partita.getGiocatoriVincenti().get(0).getNome()+ " " + partita.getGiocatoriVincenti().get(0).getCognome() + " e " +
                partita.getGiocatoriVincenti().get(1).getNome() + " " + partita.getGiocatoriVincenti().get(1).getCognome();

        partita.getUtentiPrenotati().forEach(user -> {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject(subject);
            message.setText(text);
            sendEmail(message);
        });

        return partita;
    }


    @Async
    public void sendEmail(SimpleMailMessage message) {
        javaMailSender.send(message);
    }




}
