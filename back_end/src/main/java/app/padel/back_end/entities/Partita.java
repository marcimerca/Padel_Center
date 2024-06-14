package app.padel.back_end.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "partite")
public class Partita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private final int numMaxGiocatori = 4;
    private int numGiocatoriAttuali;

    private LocalDate dataPartita;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "partite_prenotazioni",
            joinColumns = @JoinColumn(name = "partita_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )



    private List<User> utentiPrenotati = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "slot_orario_id")

    private SlotOrario slotOrario;



}
