package com.teamfoundry.backend.admin.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.admin.dto.CandidateSearchResponse;
import com.teamfoundry.backend.account_options.model.EmployeeCompetence;
import com.teamfoundry.backend.account_options.model.EmployeeFunction;
import com.teamfoundry.backend.account_options.model.EmployeeGeoArea;
import com.teamfoundry.backend.account_options.repository.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeGeoAreaRepository;
import com.teamfoundry.backend.admin.repository.EmployeeRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class CandidateSearchService {

    private static final String ADMIN_TOKEN_PREFIX = "admin:";

    private final AdminAccountRepository adminAccountRepository;
    private final EmployeeAccountRepository employeeAccountRepository;
    private final EmployeeFunctionRepository employeeFunctionRepository;
    private final EmployeeCompetenceRepository employeeCompetenceRepository;
    private final EmployeeGeoAreaRepository employeeGeoAreaRepository;
    private final EmployeeRequestRepository employeeRequestRepository;


    public CandidateSearchService(AdminAccountRepository adminAccountRepository,
                                  EmployeeAccountRepository employeeAccountRepository,
                                  EmployeeFunctionRepository employeeFunctionRepository,
                                  EmployeeCompetenceRepository employeeCompetenceRepository,
                                  EmployeeGeoAreaRepository employeeGeoAreaRepository,
                                  EmployeeRequestRepository employeeRequestRepository) { // NOVO
        this.adminAccountRepository = adminAccountRepository;
        this.employeeAccountRepository = employeeAccountRepository;
        this.employeeFunctionRepository = employeeFunctionRepository;
        this.employeeCompetenceRepository = employeeCompetenceRepository;
        this.employeeGeoAreaRepository = employeeGeoAreaRepository;
        this.employeeRequestRepository = employeeRequestRepository;
    }

    public List<CandidateSearchResponse> search(String role, List<String> areas, List<String> skills) {
        resolveAuthenticatedAdmin(); // garante que é admin
        List<String> normAreas = normalizeList(areas);
        List<String> normSkills = normalizeList(skills);
        String normRole = normalize(role);

        List<EmployeeAccount> results = employeeAccountRepository.searchCandidates(
                normRole,
                normAreas,
                normAreas.isEmpty(),
                normSkills,
                normSkills.isEmpty()
        );

        return results.stream()
                .map(this::toResponse)
                .toList();
    }

    private CandidateSearchResponse toResponse(EmployeeAccount employee) {
        String role = employeeFunctionRepository.findFirstByEmployee(employee)
                .map(rel -> rel.getFunction().getName())
                .orElse(null);

        List<String> skills = employeeCompetenceRepository.findByEmployee(employee).stream()
                .map(EmployeeCompetence::getCompetence)
                .filter(comp -> comp != null && StringUtils.hasText(comp.getName()))
                .map(comp -> comp.getName())
                .toList();

        List<String> areas = employeeGeoAreaRepository.findByEmployee(employee).stream()
                .map(EmployeeGeoArea::getGeoArea)
                .filter(area -> area != null && StringUtils.hasText(area.getName()))
                .map(area -> area.getName())
                .toList();

        List<String> experiences = employeeRequestRepository
                .findByEmployee_EmailOrderByAcceptedDateDesc(employee.getEmail().toLowerCase())
                .stream()
                .filter(req -> req.getAcceptedDate() != null)
                .limit(3)
                .map(req -> {
                    String team = req.getTeamRequest() != null ? req.getTeamRequest().getTeamName() : "Equipa";
                    String job = req.getRequestedRole() != null ? req.getRequestedRole() : "Função";
                    String date = req.getAcceptedDate().toLocalDate().toString();
                    return team + " - " + job + " (" + date + ")";
                })
                .toList();

        return new CandidateSearchResponse(
                employee.getId(),
                employee.getName(),
                employee.getSurname(),
                employee.getEmail(),
                employee.getPhone(),
                role,
                skills,
                areas,
                experiences
        );
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
                .filter(admin -> admin.getRole() == UserType.ADMIN)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrador não encontrado."));
    }

    private String normalize(String value) {
        return StringUtils.hasText(value) ? value.trim().toLowerCase(Locale.ROOT) : null;
    }

    private List<String> normalizeList(List<String> values) {
        if (values == null) return List.of();
        return values.stream()
                .filter(StringUtils::hasText)
                .map(v -> v.trim().toLowerCase(Locale.ROOT))
                .distinct()
                .toList();
    }
}
