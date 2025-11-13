package com.teamfoundry.backend.superadmin.dto.credential;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload usado para aprovar credenciais empresariais.
 */
public record CompanyApprovalRequest(
        @NotBlank(message = "superAdminPassword é obrigatório")
        String superAdminPassword
) {}
