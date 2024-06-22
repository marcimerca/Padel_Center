package app.padel.back_end.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@EqualsAndHashCode(callSuper=true)
@DiscriminatorValue("ALTRO")
@ToString(callSuper=true)

public class PrenotazioneAdmin extends Prenotazione {


}
