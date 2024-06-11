package app.padel.back_end.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
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

    @OneToMany(mappedBy = "partita")
    private List<Prenotazione> prenotazioni;

    @ManyToOne
    @JoinColumn(name = "slot_orario_id")
    private SlotOrario slotOrario;



}
