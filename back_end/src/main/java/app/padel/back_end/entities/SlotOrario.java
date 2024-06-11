package app.padel.back_end.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "slot_orari")

public class SlotOrario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime inizio;
    private LocalDateTime fine;

    @ManyToOne
    @JoinColumn(name = "campo_id")
    private Campo campo;

    @OneToMany(mappedBy = "slotOrario")
    private List<Partita> partite;
}
