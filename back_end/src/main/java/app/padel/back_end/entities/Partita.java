package app.padel.back_end.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper=true)
@ToString(callSuper=true)
@Entity
@Table(name = "partite")
@DiscriminatorValue("PARTITA")
public class Partita extends Prenotazione  {


    private final int numMaxGiocatori = 4;
    private int numGiocatoriAttuali;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "partite_prenotazioni",
            joinColumns = @JoinColumn(name = "partita_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> utentiPrenotati = new ArrayList<>();



}
