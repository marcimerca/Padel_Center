# Padel Center - Epicode Capstone Project

![Home Page](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2016.46.10.png)

## Introduzione

Il mio progetto per il capstone finale di EPICODE prevede la realizzazione di un’applicazione web di prenotazione e gestione di campi da gioco presso un fittizio circolo di padel. Negli ultimi anni mi sono appassionato a questo sport e perciò mi interessava unire quanto ho imparato durante il corso full-stack developer di EPICODE con la mia passione sportiva.


## Architettura del Progetto

- **Front-end:** Angular
- **Back-end:** Spring Boot
- **DBMS:** PostgreSQL

## Pagine e funzionalità

### Utente base

1. **Registrazione e Login degli Utenti**

![Registrazione](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2012.18.20.png)

- Alla registrazione, la password dell'utente viene criptata lato back-end tramite `BCryptPasswordEncoder`, generando un hash della password.
- Verifica delle Password: Quando un utente tenta di autenticarsi, l'encoder prende la password fornita dall'utente, applica la stessa funzione di hash e confronta il risultato con l'hash memorizzato nel database. Se i due hash coincidono, la password è considerata valida.

2. **Partite del giorno**

![Partite](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2012.31.36.png)

In questa pagina, l'utente ha una panoramica delle partite del giorno corrente prenotate dagli utenti presso il circolo. Ogni partita è rappresentata visivamente tramite una card, e ha 4 slot, ognuno occupabile da un giocatore (il numero di giocatori per una partita di padel è 4). Se una partita ha almeno uno slot libero, l'utente può aggiungersi alla stessa, cliccando sull'immagine della pallina da padel. In questo modo l'utente occupa quindi uno slot della partita, e la partita stessa sarà visualizzabile nella sezione "Partite da giocare" del suo profilo.

Nella sezione superiore della pagina, è possibile selezionare un giorno differente da quello attuale, per verificare la presenza di partite prenotate in una determinata data.

Se invece l'utente non vuole aggiungersi a una partita esistente ma desidera crearne una da zero, può cliccare sul bottone "CREA PARTITA" o sul link della navbar "Prenotazione", che lo porterà alla pagina descritta nella sezione seguente.

3. **Prenotazione**

![Prenotazione](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2011.41.44.png)

In questa pagina, è presente una visione d'insieme di tutti i campi presenti nel circolo, con i relativi slot orari e le loro disponibilità rispetto alla data corrente. Qui l'utente, selezionando uno slot libero, può creare una partita, che andrà ad aggiungersi alla sezione "Partite da giocare" della pagina "Profilo". Durante la creazione della partita, uno slot sarà occupato dall'utente stesso e rimarranno disponibili tre slot per altri utenti.

Gli slot che presentano una prenotazione da parte di un utente, invece, sono indicati con "occupato". Anche qui nella sezione superiore, è possibile selezionare un giorno differente da quello attuale e verificare le disponibilità di slot orari e campi per quella determinata data.

4. **Profilo**

![Profilo](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2011.40.45.png)

Qui l'utente ha una panoramica dei suoi dati personali, ed ha la possibilità di modificarli. 
Nella pagina sono presenti una sezione "Partite da giocare" e una sezione "Partite passate". Nelle partite da giocare sono presenti le partite dell'utente con giorno o orario di fine partita non ancora passato. Se la partita in questione si svolge fra più di 24 ore rispetto all'ora attuale, l'utente avrà la possibilità di annullarla, altrimenti dovrà contattare direttamente il circolo, tramite il numero di telefono (fittizio) indicato.

L'utente ha inoltre la possibilità di "Bloccare" le prenotazioni, impedendo ad altri utenti di potersi aggiungere alla partita. Questa funzione è stata pensata ipotizzando che alcuni giocatori iscritti al circolo, possano voler giocare con delle persone non ancora iscritte. In questo modo, bloccando le prenotazioni, riescono a riservare i posti rimanenti per i loro compagni, e la partita è indicata come "Partita completa". Una volta bloccate le prenotazioni, l'utente può comunque in qualsiasi momento cliccare su "Sblocca prenotazioni", liberando nuovamente gli slot non occupati da un giocatore iscritto al sito.

Nella sezione "Partite Passate", l'utente può registrare il risultato della partita. Seleziona il suo/la sua compagno/a di squadra ed indica il risultato ottenuto tra "Vittoria" e "Sconfitta". Una volta confermato il risultato, viene inviata una mail a tutti i partecipanti della partita indicando il risultato della stessa. Questa operazione di registrazione risultato può essere fatta solo una volta dall'utente base, mentre in caso di errori ci si può rivolgere all'utente admin, che potrà modificare il risultato indicato dall'utente. Una volta registrato il risultato, si aggiorna il conteggio delle partite perse o vinte dall'utente, indicato nella sezione superiore del profilo.

### Utente admin

L'utente con ruolo "admin" ha i privilegi per accedere a una sezione differente del sito, dalla quale può gestire diverse funzionalità.

1. **Gestione disponibilità**

![Disponibilità](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2011.43.12.png)

In questa pagina l'amministratore può vedere gli slot orari liberi ed occupati nei vari campi da gioco. Sotto la tabella, sono presenti diversi bottoni con funzionalità specifiche:
- Prenota: una volta selezionata una casella della tabella, verrà attivato il bottone "Prenota", e se premuto, darà la possibilità all'amministratore di inserire una motivazione specifica con la quale prenotare un determinato slot orario. Questa funzione è stata pensata per dare la possibilità al gestore di occupare alcuni slot orari per motivi di manutenzione, tornei, ecc.
- Cancella Prenotazione: annulla una prenotazione precedentemente creata dall'amministratore o da un utente.
- Seleziona tutto: seleziona tutti gli slot di tutti i campi, sia occupati che non occupati.
- Seleziona non occupati: seleziona tutti gli slot liberi di tutti i campi.

2. **Gestione campi**

![Campi](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2011.43.28.png)

L'amministratore qui gestisce i campi da gioco del circolo. Ha una panoramica di tutti i campi e dei relativi slot orari, e per ogni campo è possibile eseguire diverse funzioni attraverso i bottoni:
- Aggiungi slot orario: crea un nuovo slot orario (previa verifica di non sovrapposizione con un altro slot dello stesso campo).
- Elimina tutti gli slot: elimina tutti gli slot orari del campo.
- Elimina campo: rimuove il campo con tutti i suoi relativi slot orari.

È possibile inoltre creare un nuovo campo, che verrà inizialmente istanziato senza slot orari, con la possibilità di aggiungerli a seconda delle proprie preferenze.

3. **Gestione partite**

In questa pagina l'amministratore gestisce le prenotazioni da parte degli utenti. Di default, vengono visualizzate le partite prenotate per la data corrente.
Per ogni partita l'admin ha la possibilità di rimuovere un partecipante, cliccando sull'immagine dell'utente con il badge "-". In questo modo, il giocatore viene rimosso dalla partita. 
In alternativa, è possibile eliminare direttamente la partita per tutti gli utenti partecipanti, cliccando sulla "X" in alto a destra nella card della partita. 

È possibile, inoltre, registrare un risultato relativo alla partita, indicando tramite una selezione i giocatori facenti parte della stessa squadra e il risultato ottenuto. Una volta confermato, viene inviata una mail a tutti i partecipanti della partita con informazioni relative al risultato della partita. Ho inserito questa funzione di registrazione risultato anche nella parte admin in modo che in caso di errori nell'indicazione del risultato da parte dell'utente base, l'amministratore possa correggere il risultato in qualsiasi momento.

![GestionePartite1](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2015.39.46.png)
![GestionePartite2](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2015.40.01.png)

4. **Gestione utenti**

L'amministratore può cercare un utente tramite la barra di ricerca, visualizzare il suo profilo o eliminare un utente specifico.

![Utenti](https://github.com/marcimerca/Padel/blob/develop/screenshots/Screenshot%202024-07-04%20alle%2011.43.47.png)

## Tecnologie Utilizzate

- Angular
- Spring Boot
- MDBootstrap
- PostgreSQL


## Istruzioni per l'Installazione

### Prerequisiti

- Node.js e npm installati sulla tua macchina.
- Java Development Kit (JDK) installato (versione 8 o superiore).
- PostgreSQL installato e in esecuzione.


## Setup Front-end (Angular) e Back-end (Spring Boot)


### Clona il repository del progetto e naviga nella directory del front-end

```bash
git clone https://github.com/marcimerca/Padel.git
cd Padel/frontend
```





### Installa le dipendenze necessarie
`npm install`

### Avvia l'applicazione Angular
`ng serve -o`

L'applicazione sarà accessibile su http://localhost:4200

### Configura il database PostgreSQL:
 - Crea un database chiamato ad esempio "padelcenter"
 - Aggiorna il file `application.properties` con le informazioni del tuo database



```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/padelcenter
spring.datasource.username=tuo-username
spring.datasource.password=tua-password
spring.jpa.hibernate.ddl-auto=update
```


### Naviga nella directory del back-end
`cd ../backend`

### Costruisci e avvia l'applicazione Spring Boot
`./mvnw spring-boot:run`

L'applicazione sarà accessibile su http://localhost:8080
