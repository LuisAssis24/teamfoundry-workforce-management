package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.Employee.EmployeePreferencesResponse;
import com.teamfoundry.backend.account.dto.Employee.EmployeePreferencesUpdateRequest;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account_options.model.Competence;
import com.teamfoundry.backend.account_options.model.EmployeeCompetence;
import com.teamfoundry.backend.account_options.model.EmployeeFunction;
import com.teamfoundry.backend.account_options.model.EmployeeGeoArea;
import com.teamfoundry.backend.account_options.model.Function;
import com.teamfoundry.backend.account_options.model.GeoArea;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeGeoAreaRepository;
import com.teamfoundry.backend.account_options.repository.FunctionRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CandidatePreferencesService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final EmployeeFunctionRepository employeeFunctionRepository;
    private final EmployeeCompetenceRepository employeeCompetenceRepository;
    private final EmployeeGeoAreaRepository employeeGeoAreaRepository;
    private final FunctionRepository functionRepository;
    private final CompetenceRepository competenceRepository;
    private final GeoAreaRepository geoAreaRepository;

    @Transactional(readOnly = true)
    public EmployeePreferencesResponse getPreferences(String email) {
        EmployeeAccount account = findByEmailOrThrow(email);
        return toResponse(account);
    }

    @Transactional
    public EmployeePreferencesResponse updatePreferences(String email, EmployeePreferencesUpdateRequest request) {
        EmployeeAccount account = findByEmailOrThrow(email);
        applyFunctionPreference(account, request.getRole());
        applyCompetencePreferences(account, request.getSkills());
        applyGeoAreaPreferences(account, request.getAreas());
        return toResponse(account);
    }

    private EmployeePreferencesResponse toResponse(EmployeeAccount account) {
        String role = employeeFunctionRepository.findFirstByEmployee(account)
                .map(rel -> rel.getFunction().getName())
                .orElse(null);

        List<String> skills = employeeCompetenceRepository.findByEmployee(account).stream()
                .map(rel -> rel.getCompetence().getName())
                .toList();

        List<String> areas = employeeGeoAreaRepository.findByEmployee(account).stream()
                .map(rel -> rel.getGeoArea().getName())
                .toList();

        return EmployeePreferencesResponse.builder()
                .role(role)
                .skills(skills)
                .areas(areas)
                .build();
    }

    private EmployeeAccount findByEmailOrThrow(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilizador não autenticado.");
        }
        return employeeAccountRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada."));
    }

    private void applyFunctionPreference(EmployeeAccount account, String functionName) {
        employeeFunctionRepository.deleteByEmployee(account);

        if (!StringUtils.hasText(functionName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Função preferencial é obrigatória.");
        }

        Function function = functionRepository.findByName(functionName.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Função não encontrada: " + functionName
                ));

        EmployeeFunction relation = new EmployeeFunction();
        relation.setEmployee(account);
        relation.setFunction(function);
        employeeFunctionRepository.save(relation);
    }

    private void applyCompetencePreferences(EmployeeAccount account, List<String> skills) {
        employeeCompetenceRepository.deleteByEmployee(account);

        List<String> normalized = normalizeList(skills, "competência");
        if (normalized.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione pelo menos uma competência.");
        }

        List<EmployeeCompetence> relations = normalized.stream()
                .map(name -> {
                    Competence competence = competenceRepository.findByName(name)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST,
                                    "Competência não encontrada: " + name
                            ));
                    EmployeeCompetence relation = new EmployeeCompetence();
                    relation.setEmployee(account);
                    relation.setCompetence(competence);
                    return relation;
                })
                .toList();

        employeeCompetenceRepository.saveAll(relations);
    }

    private void applyGeoAreaPreferences(EmployeeAccount account, List<String> areas) {
        employeeGeoAreaRepository.deleteByEmployee(account);

        List<String> normalized = normalizeList(areas, "área geográfica");
        if (normalized.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione pelo menos uma área geográfica.");
        }

        List<EmployeeGeoArea> relations = normalized.stream()
                .map(name -> {
                    GeoArea area = geoAreaRepository.findByName(name)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST,
                                    "Área geográfica não encontrada: " + name
                            ));
                    EmployeeGeoArea relation = new EmployeeGeoArea();
                    relation.setEmployee(account);
                    relation.setGeoArea(area);
                    return relation;
                })
                .toList();

        employeeGeoAreaRepository.saveAll(relations);
    }

    private List<String> normalizeList(List<String> values, String fieldName) {
        if (Objects.isNull(values)) {
            return List.of();
        }
        return values.stream()
                .map(value -> value == null ? null : value.trim())
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }
}
