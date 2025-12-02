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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CreateFunctionServiceTest {

    private CreateFunctionRepository functionRepository;
    private CompetenceRepository competenceRepository;
    private GeoAreaRepository geoAreaRepository;
    private ActivitySectorsRepository activitySectorsRepository;
    private CreateFunctionService service;

    @BeforeEach
    void setUp() {
        functionRepository = mock(CreateFunctionRepository.class);
        competenceRepository = mock(CompetenceRepository.class);
        geoAreaRepository = mock(GeoAreaRepository.class);
        activitySectorsRepository = mock(ActivitySectorsRepository.class);
        service = new CreateFunctionService(
                functionRepository,
                competenceRepository,
                geoAreaRepository,
                activitySectorsRepository
        );
    }

    // -------- Funcoes --------

    @Test
    void criaFuncaoComSucesso() {
        CreateFunctionRequest request = new CreateFunctionRequest("  Soldador  ");

        when(functionRepository.findByNameIgnoreCase("Soldador")).thenReturn(Optional.empty());
        when(functionRepository.save(any(Function.class))).thenAnswer(invocation -> {
            Function entity = invocation.getArgument(0);
            entity.setId(10);
            return entity;
        });

        CreateFunctionResponse response = service.createFunction(request);

        assertEquals(10L, response.id());
        assertEquals("Soldador", response.name());
    }

    @Test
    void rejeitaFuncaoDuplicada() {
        CreateFunctionRequest request = new CreateFunctionRequest("Eletricista");
        when(functionRepository.findByNameIgnoreCase("Eletricista"))
                .thenReturn(Optional.of(new Function(1, "Eletricista")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.createFunction(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void apagaFuncaoExistente() {
        Function entity = new Function(5, "Soldador");
        when(functionRepository.findById(5)).thenReturn(Optional.of(entity));

        service.deleteFunction(5);

        verify(functionRepository).delete(entity);
    }

    @Test
    void erroAoApagarFuncaoInexistente() {
        when(functionRepository.findById(99)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.deleteFunction(99));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // -------- Competencias --------

    @Test
    void criaCompetencia() {
        when(competenceRepository.findByNameIgnoreCase("Soldagem")).thenReturn(Optional.empty());
        when(competenceRepository.save(any(Competence.class))).thenAnswer(invocation -> {
            Competence comp = invocation.getArgument(0);
            comp.setId(3);
            return comp;
        });

        CreateFunctionResponse response = service.createCompetence(new CreateFunctionRequest("Soldagem"));

        assertEquals(3L, response.id());
        assertEquals("Soldagem", response.name());
    }

    @Test
    void rejeitaCompetenciaDuplicada() {
        when(competenceRepository.findByNameIgnoreCase("Soldagem"))
                .thenReturn(Optional.of(new Competence(2, "Soldagem")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.createCompetence(new CreateFunctionRequest("Soldagem")));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void apagaCompetencia() {
        Competence comp = new Competence(7, "Caldeiraria");
        when(competenceRepository.findById(7)).thenReturn(Optional.of(comp));

        service.deleteCompetence(7);

        verify(competenceRepository).delete(comp);
    }

    @Test
    void erroAoApagarCompetenciaInexistente() {
        when(competenceRepository.findById(7)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.deleteCompetence(7));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // -------- Areas geograficas --------

    @Test
    void criaAreaGeografica() {
        when(geoAreaRepository.findByNameIgnoreCase("Lisboa")).thenReturn(Optional.empty());
        when(geoAreaRepository.save(any(GeoArea.class))).thenAnswer(invocation -> {
            GeoArea area = invocation.getArgument(0);
            area.setId(4);
            return area;
        });

        CreateFunctionResponse response = service.createGeoArea(new CreateFunctionRequest("Lisboa"));

        assertEquals(4L, response.id());
        assertEquals("Lisboa", response.name());
    }

    @Test
    void rejeitaAreaDuplicada() {
        when(geoAreaRepository.findByNameIgnoreCase("Lisboa"))
                .thenReturn(Optional.of(new GeoArea(1, "Lisboa")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.createGeoArea(new CreateFunctionRequest("Lisboa")));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void apagaAreaGeografica() {
        GeoArea area = new GeoArea(8, "Porto");
        when(geoAreaRepository.findById(8)).thenReturn(Optional.of(area));

        service.deleteGeoArea(8);

        verify(geoAreaRepository).delete(area);
    }

    @Test
    void erroAoApagarAreaInexistente() {
        when(geoAreaRepository.findById(12)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.deleteGeoArea(12));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // -------- Setores de atividade --------

    @Test
    void criaSetorAtividade() {
        when(activitySectorsRepository.findByNameIgnoreCase("Metalurgia")).thenReturn(Optional.empty());
        when(activitySectorsRepository.save(any(ActivitySectors.class))).thenAnswer(invocation -> {
            ActivitySectors sector = invocation.getArgument(0);
            sector.setId(9);
            return sector;
        });

        CreateFunctionResponse response = service.createActivitySector(new CreateFunctionRequest("Metalurgia"));

        assertEquals(9L, response.id());
        assertEquals("Metalurgia", response.name());
    }

    @Test
    void rejeitaSetorDuplicado() {
        when(activitySectorsRepository.findByNameIgnoreCase("Metalurgia"))
                .thenReturn(Optional.of(new ActivitySectors(5, "Metalurgia")));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.createActivitySector(new CreateFunctionRequest("Metalurgia")));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void apagaSetor() {
        ActivitySectors sector = new ActivitySectors(11, "Automocao");
        when(activitySectorsRepository.findById(11)).thenReturn(Optional.of(sector));

        service.deleteActivitySector(11);

        verify(activitySectorsRepository).delete(sector);
    }

    @Test
    void erroAoApagarSetorInexistente() {
        when(activitySectorsRepository.findById(15)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.deleteActivitySector(15));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // -------- Validacao geral --------

    @Test
    void rejeitaNomeVazioOuNulo() {
        ResponseStatusException exBlank = assertThrows(ResponseStatusException.class,
                () -> service.createFunction(new CreateFunctionRequest("   ")));
        assertEquals(HttpStatus.BAD_REQUEST, exBlank.getStatusCode());

        ResponseStatusException exNull = assertThrows(ResponseStatusException.class,
                () -> service.createFunction(null));
        assertEquals(HttpStatus.BAD_REQUEST, exNull.getStatusCode());
    }
}
