package com.teamfoundry.backend.admin.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.admin.dto.WorkRequestAdminOption;
import com.teamfoundry.backend.admin.dto.WorkRequestResponse;
import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeamRequestService {

    private final TeamRequestRepository teamRequestRepository;
    private final AdminAccountRepository adminAccountRepository;

    public List<WorkRequestResponse> listAllWorkRequests() {
        return teamRequestRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<WorkRequestAdminOption> listAssignableAdmins() {
        Map<Integer, Long> counts = teamRequestRepository.countAssignmentsGroupedByAdmin()
                .stream()
                .filter(row -> row.getAdminId() != null)
                .collect(Collectors.toMap(TeamRequestRepository.AdminAssignmentCount::getAdminId,
                        TeamRequestRepository.AdminAssignmentCount::getTotal));

        return adminAccountRepository
                .findAll(Sort.by(Sort.Direction.ASC, "username"))
                .stream()
                .filter(admin -> admin.getRole() == UserType.ADMIN)
                .map(admin -> new WorkRequestAdminOption(
                        admin.getId(),
                        admin.getUsername(),
                        counts.getOrDefault(admin.getId(), 0L)))
                .toList();
    }

    @Transactional
    public WorkRequestResponse assignResponsibleAdmin(int requestId, int adminId) {
        TeamRequest request = teamRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requisição não encontrada."));

        AdminAccount admin = adminAccountRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado."));

        if (admin.getRole() != UserType.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Somente administradores comuns podem ser responsáveis.");
        }

        request.setResponsibleAdminId(admin.getId());
        TeamRequest saved = teamRequestRepository.save(request);
        return toResponse(saved);
    }

    private WorkRequestResponse toResponse(TeamRequest request) {
        CompanyAccount company = request.getCompany();
        String companyName = company != null ? company.getName() : null;
        String companyEmail = company != null ? company.getEmail() : null;

        return new WorkRequestResponse(
                request.getId(),
                companyName,
                companyEmail,
                request.getTeamName(),
                request.getDescription(),
                request.getState(),
                request.getResponsibleAdminId(),
                request.getStartDate(),
                request.getEndDate(),
                request.getCreatedAt()
        );
    }
}
