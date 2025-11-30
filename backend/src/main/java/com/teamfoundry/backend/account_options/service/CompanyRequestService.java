package com.teamfoundry.backend.account_options.service;

import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import com.teamfoundry.backend.account_options.dto.company.CompanyRequestCreateRequest;
import com.teamfoundry.backend.account_options.dto.company.CompanyRequestResponse;
import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Serviço para consultar e criar requisições de equipa pela empresa autenticada.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyRequestService {

    private final TeamRequestRepository teamRequestRepository;
    private final CompanyAccountRepository companyAccountRepository;

    /**
     * Lista todas as requisições da empresa autenticada, ordenadas por criação.
     */
    public List<CompanyRequestResponse> listCompanyRequests(String email) {
        CompanyAccount company = resolveCompany(email);
        return teamRequestRepository.findByCompany_EmailOrderByCreatedAtDesc(company.getEmail())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Cria uma nova requisição de equipa para a empresa autenticada.
     */
    @Transactional
    public CompanyRequestResponse createRequest(String email, CompanyRequestCreateRequest request) {
        CompanyAccount company = resolveCompany(email);
        TeamRequest entity = new TeamRequest();
        entity.setCompany(company);
        entity.setTeamName(request.getTeamName());
        entity.setDescription(request.getDescription());
        entity.setLocation(request.getLocation());
        entity.setState(State.INCOMPLETE);
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setCreatedAt(LocalDateTime.now());

        TeamRequest saved = teamRequestRepository.save(entity);
        return toResponse(saved);
    }

    private CompanyRequestResponse toResponse(TeamRequest request) {
        return CompanyRequestResponse.builder()
                .id(request.getId())
                .teamName(request.getTeamName())
                .description(request.getDescription())
                .location(request.getLocation())
                .state(request.getState())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdAt(request.getCreatedAt())
                .computedStatus(deriveStatus(request))
                .build();
    }

    /**
     * Calcula rótulo amigável para as tabs (ativa/pendente/passada).
     */
    private String deriveStatus(TeamRequest request) {
        LocalDateTime now = LocalDateTime.now();
        if (request.getState() == State.COMPLETE || (request.getEndDate() != null && request.getEndDate().isBefore(now))) {
            return "PAST";
        }
        if (request.getStartDate() != null && request.getStartDate().isAfter(now)) {
            return "PENDING";
        }
        return "ACTIVE";
    }

    private CompanyAccount resolveCompany(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação requerida.");
        }
        return companyAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa não encontrada."));
    }
}
