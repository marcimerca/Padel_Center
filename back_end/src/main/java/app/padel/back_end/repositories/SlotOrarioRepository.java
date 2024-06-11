package app.padel.back_end.repositories;

import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.SlotOrario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlotOrarioRepository extends JpaRepository<SlotOrario,Integer> {
}
