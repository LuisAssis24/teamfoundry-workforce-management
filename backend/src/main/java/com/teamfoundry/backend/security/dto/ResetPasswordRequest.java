package com.teamfoundry.backend.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @Email @NotBlank String email,
        @NotBlank String code,
        @NotBlank String newPassword
) { }

