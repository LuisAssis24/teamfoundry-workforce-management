package com.teamfoundry.backend.admin.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.admin.model.EmployeeRequest;
import com.teamfoundry.backend.admin.model.EmployeeRequestEmployee;
import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.repository.EmployeeRequestEmployeeRepository;
import com.teamfoundry.backend.admin.repository.EmployeeRequestRepository;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;


/**
 * Envio de convites em massa para vagas abertas de uma função.
 * Bloqueia requisições concluídas e evita convidar quem já ocupa vaga na equipa.
 */
@Service
@RequiredArgsConstructor
public class AdminInvitationService {

    private static final String ADMIN_TOKEN_PREFIX = "admin:";

    private final TeamRequestRepository teamRequestRepository;
    private final EmployeeRequestRepository employeeRequestRepository;
    private final EmployeeRequestEmployeeRepository inviteRepository;
    private final EmployeeAccountRepository employeeAccountRepository;
    private final AdminAccountRepository adminAccountRepository;

    @Transactional
    public int sendInvites(Integer teamRequestId, String role, List<Integer> candidateIds) {
        AdminAccount admin = resolveAuthenticatedAdmin();
        TeamRequest request = teamRequestRepository.findById(teamRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requisição não encontrada."));
        if (!Objects.equals(request.getResponsibleAdminId(), admin.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requisição não atribuída a este administrador.");
        }
        if (request.getState() == State.COMPLETE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Requisição já concluída; não é possível enviar convites.");
        }

        String normRole = normalize(role);
        if (!StringUtils.hasText(normRole)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Função é obrigatória.");
        }
        if (candidateIds == null || candidateIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione pelo menos um candidato.");
        }

        // Não convidar quem já ocupa vaga nesta equipa
        Set<Integer> acceptedIds = new HashSet<>(employeeRequestRepository.findAcceptedEmployeeIdsByTeam(teamRequestId));

        List<EmployeeRequest> openRequests = employeeRequestRepository
                .findByTeamRequest_IdAndRequestedRoleIgnoreCaseAndEmployeeIsNull(teamRequestId, normRole);

        if (openRequests.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não há vagas abertas para esta função.");
        }

        List<EmployeeRequestEmployee> toSave = new ArrayList<>();
        for (EmployeeRequest er : openRequests) {
            for (Integer candidateId : candidateIds) {
                if (acceptedIds.contains(candidateId)) continue; // já ocupa vaga na equipa
                Optional<EmployeeAccount> candidateOpt = employeeAccountRepository.findById(candidateId);
                if (candidateOpt.isEmpty()) continue;
                if (inviteRepository.existsByEmployeeRequest_IdAndEmployee_IdAndActiveTrue(er.getId(), candidateId)) {
                    continue; // já tem convite ativo
                }
                EmployeeRequestEmployee invite = new EmployeeRequestEmployee();
                invite.setEmployeeRequest(er);
                invite.setEmployee(candidateOpt.get());
                invite.setActive(true);
                toSave.add(invite);
            }
        }

        if (toSave.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nenhum convite novo foi criado (duplicados, sem vagas ou já aceitou outra vaga na equipa).");
        }

        inviteRepository.saveAll(toSave);
        return toSave.size();
    }

    @Transactional(readOnly = true)
    public List<Integer> listActiveInviteIds(Integer teamId, String role) {
        AdminAccount admin = resolveAuthenticatedAdmin();
        TeamRequest request = teamRequestRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requisição não encontrada."));
        if (!Objects.equals(request.getResponsibleAdminId(), admin.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requisição não atribuída a este administrador.");
        }
        String normRole = normalize(role);
        if (!StringUtils.hasText(normRole)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Função é obrigatória.");
        }
        return inviteRepository.findActiveInviteEmployeeIdsByTeamAndRole(teamId, normRole);
    }

    @Transactional(readOnly = true)
    public List<Integer> listAcceptedIds(Integer teamId) {
        AdminAccount admin = resolveAuthenticatedAdmin();
        TeamRequest request = teamRequestRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Requisição não encontrada."));
        if (!Objects.equals(request.getResponsibleAdminId(), admin.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requisição não atribuída a este administrador.");
        }
        return employeeRequestRepository.findAcceptedEmployeeIdsByTeam(teamId);
    }

    private AdminAccount resolveAuthenticatedAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação requerida.");
        }
        String principal = authentication.getName();
        if (principal == null || !principal.startsWith(ADMIN_TOKEN_PREFIX)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente administradores autenticados.");
        }
        String username = principal.substring(ADMIN_TOKEN_PREFIX.length());
        return adminAccountRepository.findByUsernameIgnoreCase(username)
                .filter(a -> a.getRole() == UserType.ADMIN)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrador não encontrado."));
    }

    private String normalize(String value) {
        return StringUtils.hasText(value) ? value.trim().toLowerCase(Locale.ROOT) : null;
    }
}
