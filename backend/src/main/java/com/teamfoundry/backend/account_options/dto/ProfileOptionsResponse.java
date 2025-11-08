package com.teamfoundry.backend.account_options.dto;

import java.util.List;

/**
 * DTO que expõe as opções de funções, competências e áreas geográficas para o front.
 */
public record ProfileOptionsResponse(
        List<String> functions,
        List<String> competences,
        List<String> geoAreas
) {
}
