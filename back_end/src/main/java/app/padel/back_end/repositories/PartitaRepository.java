package app.padel.back_end.repositories;

import app.padel.back_end.entities.Partita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartitaRepository extends JpaRepository<Partita,Integer> {
}
