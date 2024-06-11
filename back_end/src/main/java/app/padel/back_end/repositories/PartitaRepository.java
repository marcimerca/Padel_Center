package app.padel.back_end.repositories;

import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.SlotOrario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PartitaRepository extends JpaRepository<Partita,Integer> {
    public Optional<Partita> findByDataPartitaAndSlotOrario(LocalDate data, SlotOrario slotOrario);
}
