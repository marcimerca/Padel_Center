package app.padel.back_end.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "campi")
public class Campo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nomeCampo;

    @OneToMany(mappedBy = "campo")
    private List<SlotOrario> slotOrari;





}
