package app.padel.back_end.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private List<SlotOrario> slotOrari;


}
