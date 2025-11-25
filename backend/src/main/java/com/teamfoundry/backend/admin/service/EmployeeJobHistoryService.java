package com.teamfoundry.backend.admin.service;

import com.teamfoundry.backend.admin.dto.EmployeeJobSummary;
import com.teamfoundry.backend.admin.model.EmployeeRequest;
import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.repository.EmployeeRequestRepository;
import com.teamfoundry.backend.account.model.CompanyAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeJobHistoryService {

    private final EmployeeRequestRepository employeeRequestRepository;

    /**
     * Lista os pedidos (requests) associados ao colaborador, já aceites/associados.
     */
    @Transactional(readOnly = true)
    public List<EmployeeJobSummary> listJobsForEmployee(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilizador não autenticado.");
        }
        String normalizedEmail = email.trim().toLowerCase();
        List<EmployeeRequest> requests = employeeRequestRepository.findByEmployee_EmailOrderByAcceptedDateDesc(normalizedEmail);
        return requests.stream()
                .map(this::toSummary)
                .toList();
    }

    private EmployeeJobSummary toSummary(EmployeeRequest req) {
        TeamRequest teamRequest = req.getTeamRequest();
        CompanyAccount company = teamRequest != null ? teamRequest.getCompany() : null;

        return EmployeeJobSummary.builder()
                .requestId(req.getId())
                .teamName(teamRequest != null ? teamRequest.getTeamName() : null)
                .companyName(company != null ? company.getName() : null)
                .location(teamRequest != null ? teamRequest.getLocation() : null)
                .description(teamRequest != null ? teamRequest.getDescription() : null)
                .startDate(teamRequest != null ? teamRequest.getStartDate() : null)
                .endDate(teamRequest != null ? teamRequest.getEndDate() : null)
                .acceptedDate(req.getAcceptedDate())
                .requestedRole(req.getRequestedRole())
                .state(req.getState())
                .build();
    }
}
