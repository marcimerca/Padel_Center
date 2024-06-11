package app.padel.back_end.repositories;

import app.padel.back_end.entities.Campo;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampoRepository extends JpaRepository<Campo, Integer> {
    public Optional<Campo> findByNomeCampo(String nome);
}
