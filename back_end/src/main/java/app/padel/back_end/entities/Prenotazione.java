package app.padel.back_end.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "tipo_prenotazione", discriminatorType = DiscriminatorType.STRING)
public abstract class Prenotazione {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_orario_id")
    private SlotOrario slotOrario;

    private LocalDate dataPrenotazione;

    private String motivoPrenotazione;


}
