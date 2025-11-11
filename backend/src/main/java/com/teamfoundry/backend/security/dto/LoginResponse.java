package com.teamfoundry.backend.security.dto;

public record LoginResponse(
        String userType,
        String message,
        String accessToken,
        long expiresInSeconds
) {
}
