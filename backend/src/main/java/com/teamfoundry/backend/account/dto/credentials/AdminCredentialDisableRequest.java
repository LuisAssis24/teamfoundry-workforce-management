package com.teamfoundry.backend.account.dto.credentials;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload usado para desativar administradores.
 */
public record AdminCredentialDisableRequest(
        @NotBlank(message = "superAdminPassword é obrigatório")
        String superAdminPassword
) {}
