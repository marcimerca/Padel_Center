package app.padel.back_end.services;

import app.padel.back_end.dto.AuthDataDto;
import app.padel.back_end.dto.UserDto;
import app.padel.back_end.entities.Partita;
import app.padel.back_end.entities.User;
import app.padel.back_end.enums.Ruolo;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.PrenotazioneRepository;
import app.padel.back_end.repositories.UserRepository;
import app.padel.back_end.security.JwtTool;
import com.cloudinary.Cloudinary;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public PasswordEncoder passwordEncoder;

    @Autowired
    public PrenotazioneRepository prenotazioneRepository;

    @Autowired
    public PrenotazioneService prenotazioneService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private JwtTool jwtTool;



    public String saveUser(UserDto userDto) throws IOException {
        Optional<User> userOptional = getUserByEmail(userDto.getEmail());
        if (userOptional.isPresent()) {
            throw new BadRequestException("Email già presente nel sistema.");
        }

        Optional<User> userOptionalUsername = getUserByUsername(userDto.getUsername());
        if (userOptionalUsername.isPresent()) {
            throw new BadRequestException("Username già presente nel sistema.");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setNome(userDto.getNome());
        user.setCognome(userDto.getCognome());
        user.setEmail(userDto.getEmail());
        user.setRuolo(Ruolo.USER);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        if (userDto.getAvatar() != null && !userDto.getAvatar().isEmpty()) {
            String url = (String) cloudinary.uploader().upload(userDto.getAvatar().getBytes(), Collections.emptyMap()).get("url");
            user.setAvatar(url);
        }

        userRepository.save(user);
        return "Utente con username " + user.getUsername() + " inserito correttamente.";
    }
    public List<User> getAllUsers() {
        ;
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User updateUserByAdmin(int id, UserDto userDto) throws IOException {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));

            if (userDto.getAvatar() != null && !userDto.getAvatar().isEmpty()) {
                String url = (String) cloudinary.uploader().upload(userDto.getAvatar().getBytes(), Collections.emptyMap()).get("url");
                user.setAvatar(url);
            }
            userRepository.save(user);
            return user;
        } else {
            throw new NotFoundException("L' utente con id " + id + " non è stato trovato");
        }


    }



    public AuthDataDto updateUser(UserDto userDto) throws IOException {

        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        if (!loggedUser.getEmail().equals(userDto.getEmail())) {
            Optional<User> emailUser = getUserByEmail(userDto.getEmail());
            if (emailUser.isPresent() && emailUser.get().getId() != (loggedUser.getId())) {
                throw new BadRequestException("Email già presente nel sistema.");
            }
        }

        if (!loggedUser.getUsername().equals(userDto.getUsername())) {
            Optional<User> usernameUser = getUserByUsername(userDto.getUsername());
            if (usernameUser.isPresent() && usernameUser.get().getId() != (loggedUser.getId())) {
                throw new BadRequestException("Username già presente nel sistema.");
            }
        }

        loggedUser.setUsername(userDto.getUsername());
        loggedUser.setNome(userDto.getNome());
        loggedUser.setCognome(userDto.getCognome());
        loggedUser.setEmail(userDto.getEmail());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            loggedUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getAvatar() != null && !userDto.getAvatar().isEmpty()) {
            String url = (String) cloudinary.uploader().upload(userDto.getAvatar().getBytes(), Collections.emptyMap()).get("url");
            loggedUser.setAvatar(url);
        }

        userRepository.save(loggedUser);

        AuthDataDto authDataDto = new AuthDataDto();
        authDataDto.setAccessToken(jwtTool.createToken(loggedUser));
        authDataDto.setRuolo(loggedUser.getRuolo());
        authDataDto.setNome(loggedUser.getNome());
        authDataDto.setCognome(loggedUser.getCognome());
        authDataDto.setEmail(loggedUser.getEmail());
        authDataDto.setUsername(loggedUser.getUsername());
        authDataDto.setId(loggedUser.getId());
        authDataDto.setAvatar(loggedUser.getAvatar());

        return authDataDto;
    }


    public User deleteUser(int id) {
        Optional<User> utenteOptional = getUserById(id);
        if (utenteOptional.isPresent()) {
            User user = utenteOptional.get();
            List<Partita> partiteUser = prenotazioneService.findPartiteByUser(user);
            partiteUser.forEach((partita -> prenotazioneService.annullaPrenotazionePartitaAdmin(partita.getId(), user.getId())));
            partiteUser.forEach(partita -> prenotazioneRepository.save(partita));
            userRepository.delete(utenteOptional.get());
            return user;
        } else {
            throw new NotFoundException("L' utente con id " + id + " non è stato trovato");
        }

    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }



    public String patchAvatarUtente(MultipartFile foto) throws IOException {
        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String url = (String) cloudinary.uploader().upload(foto.getBytes(), Collections.emptyMap()).get("url");

        loggedUser.setAvatar(url);
        userRepository.save(loggedUser);
        return "Foto avatar con url " + url + " salvata e associata correttamente all'utente con id " + loggedUser.getId();

    }


}



