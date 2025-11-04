package com.teamfoundry.backend.security.dto;

public record AuthResponse(
        String acessToken,
        String refreshToken,
        long expiresIn,
        String role
) {
}
