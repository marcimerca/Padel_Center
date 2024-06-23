package app.padel.back_end.repositories;

import app.padel.back_end.entities.Campo;
import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.SlotOrario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface SlotOrarioRepository extends JpaRepository<SlotOrario,Integer> {


    public List<SlotOrario> findByCampoId(int campoId);

    List<SlotOrario> findByCampoIdAndInizioLessThanAndFineGreaterThan(int campoId, LocalTime fine, LocalTime inizio);

    public void deleteByCampo(Campo campo);

    public List<SlotOrario> findByCampo(Campo campo);
}
