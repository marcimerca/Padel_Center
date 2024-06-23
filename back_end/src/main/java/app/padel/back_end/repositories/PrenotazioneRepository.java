package app.padel.back_end.repositories;

import app.padel.back_end.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PrenotazioneRepository extends JpaRepository<Prenotazione,Integer> {
    public Optional<Prenotazione> findByDataPrenotazioneAndSlotOrario(LocalDate data, SlotOrario slotOrario);

    public List<Prenotazione> findBySlotOrario(SlotOrario slotOrario);

    public List<Partita> findByDataPrenotazione(LocalDate date);

    public List<Partita> findByUtentiPrenotati(User user);

    List<PrenotazioneAdmin> findByMotivoPrenotazione(String motivo);

    public void deleteBySlotOrario(SlotOrario slotOrario);
}
