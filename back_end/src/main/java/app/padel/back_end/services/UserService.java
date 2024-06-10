package app.padel.back_end.services;

import app.padel.back_end.dto.UserDto;
import app.padel.back_end.entities.User;
import app.padel.back_end.enums.Ruolo;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    public PasswordEncoder passwordEncoder;

    public String saveUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setNome((userDto.getNome()));
        user.setCognome((userDto.getCognome()));
        user.setEmail((userDto.getEmail()));
        user.setAvatar(userDto.getAvatar());
        user.setRuolo(Ruolo.USER);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        utenteRepository.save(user);
        return "Utente con username" + user.getUsername() + " inserito correttamente.";

    }

    public List<User> getAllUsers() {
        ;
        return utenteRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return utenteRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return utenteRepository.findByEmail(email);
    }

    public User updateUserByAdmin(int id, UserDto userDto) {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            utenteRepository.save(user);
            return user;
        } else {
            throw new NotFoundException("L' utente con id " + id + " non è stato trovato");
        }


    }

    public User updateUser(int id, UserDto userDto) {
        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        loggedUser.setNome(userDto.getNome());
        loggedUser.setCognome(userDto.getCognome());
        loggedUser.setUsername(userDto.getUsername());
        loggedUser.setEmail(userDto.getEmail());
        loggedUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        utenteRepository.save(loggedUser);
        return loggedUser;
    }


    public String deleteUser(int id) {
        Optional<User> utenteOptional = getUserById(id);
        if (utenteOptional.isPresent()) {
            User user = utenteOptional.get();
            utenteRepository.delete(utenteOptional.get());
            return "L' utente con id " + id + " è stato eliminato con successo.";
        } else {
            throw new NotFoundException("L' utente con id " + id + " non è stato trovato");
        }

    }

/*
    public String patchAvatarUtente(MultipartFile foto) throws IOException {
        User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String url = (String) cloudinary.uploader().upload(foto.getBytes(), Collections.emptyMap()).get("url");

        loggedUser.setAvatar(url);
        utenteRepository.save(loggedUser);
        return "Foto avatar con url " + url + " salvata e associata correttamente all'utente con id " + loggedUser.getId();

    }
*/

}



