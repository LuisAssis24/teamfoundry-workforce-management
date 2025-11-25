package com.teamfoundry.backend.site.service;

import com.teamfoundry.backend.account_options.model.ActivitySectors;
import com.teamfoundry.backend.account_options.model.Competence;
import com.teamfoundry.backend.account_options.model.Function;
import com.teamfoundry.backend.account_options.model.GeoArea;
import com.teamfoundry.backend.account_options.repository.ActivitySectorsRepository;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import com.teamfoundry.backend.site.dto.CreateFunctionRequest;
import com.teamfoundry.backend.site.dto.CreateFunctionResponse;
import com.teamfoundry.backend.site.repository.CreateFunctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

/**
 * Regras de negocio para criar, listar e remover opcoes globais
 * (funcoes, competencias, areas geograficas e setores de atividade).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CreateFunctionService {

    private final CreateFunctionRepository functionRepository;
    private final CompetenceRepository competenceRepository;
    private final GeoAreaRepository geoAreaRepository;
    private final ActivitySectorsRepository activitySectorsRepository;

    // -------- Funcoes --------

    /**
     * Lista todas as funcoes.
     */
    @Transactional(readOnly = true)
    public List<CreateFunctionResponse> listFunctions() {
        return functionRepository.findAll().stream()
                .map(entity -> new CreateFunctionResponse((long) entity.getId(), entity.getName()))
                .toList();
    }

    /**
     * Cria uma nova funcao.
     */
    public CreateFunctionResponse createFunction(CreateFunctionRequest request) {
        String normalized = normalize(request);
        ensureNotExists(normalized, name -> functionRepository.findByNameIgnoreCase(name));
        Function entity = new Function();
        entity.setName(normalized);
        Function saved = functionRepository.save(entity);
        return new CreateFunctionResponse((long) saved.getId(), saved.getName());
    }

    /**
     * Apaga uma funcao existente.
     */
    public void deleteFunction(Integer id) {
        Function function = functionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcao nao encontrada."));
        functionRepository.delete(function);
    }

    // -------- Competencias --------

    @Transactional(readOnly = true)
    public List<CreateFunctionResponse> listCompetences() {
        return competenceRepository.findAll().stream()
                .map(entity -> new CreateFunctionResponse((long) entity.getId(), entity.getName()))
                .toList();
    }

    public CreateFunctionResponse createCompetence(CreateFunctionRequest request) {
        String normalized = normalize(request);
        ensureNotExists(normalized, name -> competenceRepository.findByNameIgnoreCase(name));
        Competence entity = new Competence();
        entity.setName(normalized);
        Competence saved = competenceRepository.save(entity);
        return new CreateFunctionResponse((long) saved.getId(), saved.getName());
    }

    public void deleteCompetence(Integer id) {
        Competence competence = competenceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Competencia nao encontrada."));
        competenceRepository.delete(competence);
    }

    // -------- Areas geograficas --------

    @Transactional(readOnly = true)
    public List<CreateFunctionResponse> listGeoAreas() {
        return geoAreaRepository.findAll().stream()
                .map(entity -> new CreateFunctionResponse((long) entity.getId(), entity.getName()))
                .toList();
    }

    public CreateFunctionResponse createGeoArea(CreateFunctionRequest request) {
        String normalized = normalize(request);
        ensureNotExists(normalized, name -> geoAreaRepository.findByNameIgnoreCase(name));
        GeoArea entity = new GeoArea();
        entity.setName(normalized);
        GeoArea saved = geoAreaRepository.save(entity);
        return new CreateFunctionResponse((long) saved.getId(), saved.getName());
    }

    public void deleteGeoArea(Integer id) {
        GeoArea area = geoAreaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Area geografica nao encontrada."));
        geoAreaRepository.delete(area);
    }

    // -------- Setores de atividade --------

    @Transactional(readOnly = true)
    public List<CreateFunctionResponse> listActivitySectors() {
        return activitySectorsRepository.findAll().stream()
                .map(entity -> new CreateFunctionResponse((long) entity.getId(), entity.getName()))
                .toList();
    }

    public CreateFunctionResponse createActivitySector(CreateFunctionRequest request) {
        String normalized = normalize(request);
        ensureNotExists(normalized, name -> activitySectorsRepository.findByNameIgnoreCase(name));
        ActivitySectors entity = new ActivitySectors();
        entity.setName(normalized);
        ActivitySectors saved = activitySectorsRepository.save(entity);
        return new CreateFunctionResponse((long) saved.getId(), saved.getName());
    }

    public void deleteActivitySector(Integer id) {
        ActivitySectors sector = activitySectorsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor de atividade nao encontrado."));
        activitySectorsRepository.delete(sector);
    }

    // -------- Helpers --------

    private String normalize(CreateFunctionRequest request) {
        String normalized = request != null && request.name() != null ? request.name().trim() : "";
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome e obrigatorio.");
        }
        return normalized;
    }

    private void ensureNotExists(String name, java.util.function.Function<String, Optional<?>> finder) {
        finder.apply(name).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe um registo com esse nome.");
        });
    }
}
