package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.dto.AdminEmployeeProfileResponse;
import com.teamfoundry.backend.admin.service.AdminEmployeeProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * Perfil do colaborador (consulta por admin), incluindo experiências concluídas (máx. 2).
 */
@RestController
@RequestMapping(value = "/api/admin/employees", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AdminEmployeeProfileController {

    private final AdminEmployeeProfileService adminEmployeeProfileService;

    @GetMapping("/{id}/profile")
    public AdminEmployeeProfileResponse getProfile(@PathVariable Integer id) {
        return adminEmployeeProfileService.getProfile(id);
    }
}
