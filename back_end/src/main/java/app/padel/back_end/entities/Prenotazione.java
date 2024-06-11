package app.padel.back_end.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "prenotazioni")
public class Prenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "partita_id")
    private Partita partita;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
