package app.padel.back_end.repositories;

import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.Prenotazione;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrenotazioneRepository extends JpaRepository<Prenotazione,Integer> {
}
