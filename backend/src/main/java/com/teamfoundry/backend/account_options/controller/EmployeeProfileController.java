package com.teamfoundry.backend.account_options.controller;

import com.teamfoundry.backend.account_options.dto.employee.EmployeeProfileResponse;
import com.teamfoundry.backend.account_options.dto.employee.EmployeeProfileUpdateRequest;
import com.teamfoundry.backend.account_options.service.EmployeeProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/employee/profile", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class EmployeeProfileController {

    private final EmployeeProfileService employeeProfileService;

    /**
     * Devolve os dados básicos do perfil do colaborador autenticado.
     */
    @GetMapping
    public EmployeeProfileResponse getProfile(Authentication authentication) {
        return employeeProfileService.getProfile(resolveEmail(authentication));
    }

    /**
     * Atualiza os campos do perfil (nome, género, contactos) do colaborador autenticado.
     */
    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public EmployeeProfileResponse updateProfile(
            @Valid @RequestBody EmployeeProfileUpdateRequest request,
            Authentication authentication) {
        return employeeProfileService.updateProfile(resolveEmail(authentication), request);
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return authentication.getName();
    }
}
