package com.teamfoundry.backend.admin.service;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account_options.model.employee.EmployeeCompetence;
import com.teamfoundry.backend.account_options.model.employee.EmployeeFunction;
import com.teamfoundry.backend.account_options.model.employee.EmployeeGeoArea;
import com.teamfoundry.backend.account_options.repository.employee.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.employee.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.employee.EmployeeGeoAreaRepository;
import com.teamfoundry.backend.admin.dto.AdminEmployeeProfileResponse;
import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.model.EmployeeRequest;
import com.teamfoundry.backend.admin.repository.EmployeeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Perfil do colaborador (consulta por admin), incluindo experiências concluídas (máx. 2).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminEmployeeProfileService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final EmployeeFunctionRepository employeeFunctionRepository;
    private final EmployeeCompetenceRepository employeeCompetenceRepository;
    private final EmployeeGeoAreaRepository employeeGeoAreaRepository;
    private final EmployeeRequestRepository employeeRequestRepository;

    public AdminEmployeeProfileResponse getProfile(Integer employeeId) {
        EmployeeAccount employee = employeeAccountRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado."));

        String preferredRole = employeeFunctionRepository.findFirstByEmployee(employee)
                .map(EmployeeFunction::getFunction)
                .filter(f -> f != null && StringUtils.hasText(f.getName()))
                .map(f -> f.getName())
                .orElse(null);

        List<String> skills = employeeCompetenceRepository.findByEmployee(employee).stream()
                .map(EmployeeCompetence::getCompetence)
                .filter(c -> c != null && StringUtils.hasText(c.getName()))
                .map(c -> c.getName())
                .toList();

        List<String> areas = employeeGeoAreaRepository.findByEmployee(employee).stream()
                .map(EmployeeGeoArea::getGeoArea)
                .filter(a -> a != null && StringUtils.hasText(a.getName()))
                .map(a -> a.getName())
                .toList();

        List<String> experiences =
                employeeRequestRepository.findByEmployee_IdOrderByAcceptedDateDesc(employeeId).stream()
                        .filter(req -> req.getAcceptedDate() != null && isConcluded(req))
                        .limit(2)
                        .map(this::toExperienceLabel)
                        .toList();

        return new AdminEmployeeProfileResponse(
                employee.getId(),
                employee.getName(),
                employee.getSurname(),
                employee.getGender(),
                employee.getBirthDate(),
                employee.getNationality(),
                employee.getPhone(),
                employee.getEmail(),
                preferredRole,
                skills,
                areas,
                experiences
        );
    }

    private String toExperienceLabel(EmployeeRequest req) {
        String company = (req.getTeamRequest() != null && req.getTeamRequest().getCompany() != null)
                ? req.getTeamRequest().getCompany().getName()
                : "Empresa";
        String job = req.getRequestedRole() != null ? req.getRequestedRole() : "Função";
        String date = req.getAcceptedDate() != null ? req.getAcceptedDate().toLocalDate().toString() : "";
        return company + " - " + job + (date.isEmpty() ? "" : " (" + date + ")");
    }

    private boolean isConcluded(EmployeeRequest req) {
        if (req.getTeamRequest() == null) return false;
        var tr = req.getTeamRequest();
        if (tr.getState() == State.COMPLETE) return true;
        LocalDateTime end = tr.getEndDate();
        return end != null && end.isBefore(LocalDateTime.now());
    }
}
