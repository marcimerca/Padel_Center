package app.padel.back_end.services;

import app.padel.back_end.dto.CampoDto;
import app.padel.back_end.entities.Campo;
import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.BadRequestException;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.repositories.CampoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampoService {

    @Autowired
    private CampoRepository campoRepository;

    public String saveCampo(CampoDto campoDto) {
        Optional<Campo> campoOptional = getCampoByNome(campoDto.getNomeCampo());
        if(campoOptional.isPresent()){
            throw new BadRequestException("Il nome " + campoDto.getNomeCampo() + " risulta già presente, sceglierne uno differente");
        }
        Campo campo = new Campo();
        campo.setNomeCampo(campoDto.getNomeCampo());
        campoRepository.save(campo);
        return "Campo " + campo.getNomeCampo() + " inserito correttamente.";

    }

    public List<Campo> getAllCampi() {
        return campoRepository.findAll();
    }

    public Optional<Campo> getCampoById(int id) {
        return campoRepository.findById(id);
    }
    public Optional<Campo> getCampoByNome(String nome) {
        return campoRepository.findByNomeCampo(nome);
    }

    public Campo updateCampo(int id, CampoDto campoDto) {
        Optional<Campo> campoOptional = getCampoById(id);
        if (campoOptional.isPresent()) {
            Optional<Campo> campoOptionalNome = getCampoByNome(campoDto.getNomeCampo());
            if(campoOptionalNome.isPresent()){
                throw new BadRequestException("Il nome " + campoDto.getNomeCampo() + " risulta già presente, sceglierne uno differente");
            }
            Campo campo = campoOptional.get();
            campo.setNomeCampo(campoDto.getNomeCampo());
            return campo;
        } else {
            throw new NotFoundException("Il campo con id " + id + "non è stato trovato");
        }

    }

    public String deleteCampo(int id) {
        Optional<Campo> campoOptional = getCampoById(id);
        if(campoOptional.isPresent()){
            campoRepository.delete(campoOptional.get());
           return "Campo " + campoOptional.get().getNomeCampo() + " eliminato correttamente.";
        } else {
            throw new NotFoundException("Il campo con id " + id + "non è stato trovato");
        }

    }
}
