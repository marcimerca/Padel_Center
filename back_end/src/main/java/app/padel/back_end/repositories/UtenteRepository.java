package app.padel.back_end.repositories;

import app.padel.back_end.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtenteRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByEmail(String email);
}
