package app.padel.back_end.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@Table(name = "slot_orari")

public class SlotOrario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalTime inizio;
    private LocalTime fine;

    @ManyToOne
    @JoinColumn(name = "campo_id")
    private Campo campo;

    @OneToMany(mappedBy = "slotOrario")
    @JsonIgnore
    private List<Partita> partite;
}
