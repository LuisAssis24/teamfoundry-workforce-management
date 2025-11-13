package com.teamfoundry.backend.account.dto.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO usado para solicitar o reenvio do código de verificação por e-mail.
 */
public record VerificationResendRequest(
        @Email @NotBlank String email
) {
}
