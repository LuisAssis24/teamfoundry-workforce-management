package com.teamfoundry.backend.account_options.service;

import com.teamfoundry.backend.account_options.dto.ProfileOptionsResponse;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.FunctionRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * Serviço responsável por reunir as listas de opções utilizadas no passo de preferências.
 */
@Service
@RequiredArgsConstructor
public class ProfileOptionsService {

    private final FunctionRepository functionRepository;
    private final CompetenceRepository competenceRepository;
    private final GeoAreaRepository geoAreaRepository;

    /**
     * Devolve todas as opções disponíveis (ordenadas alfabeticamente) para o frontend.
     *
     * @return DTO contendo listas de funções, competências e áreas geográficas.
     */
    public ProfileOptionsResponse fetchOptions() {
        var functions = functionRepository.findAll().stream()
                .map(entity -> entity.getName())
                .sorted()
                .collect(Collectors.toList());

        var competences = competenceRepository.findAll().stream()
                .map(entity -> entity.getName())
                .sorted()
                .collect(Collectors.toList());

        var geoAreas = geoAreaRepository.findAll().stream()
                .map(entity -> entity.getName())
                .sorted()
                .collect(Collectors.toList());

        return new ProfileOptionsResponse(functions, competences, geoAreas);
    }
}
