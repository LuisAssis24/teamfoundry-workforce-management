package com.teamfoundry.backend.admin.dto;

public record TeamRequestRoleSummary(
        String role,
        long totalPositions,
        long filledPositions,
        long openPositions,
        long proposalsSent
) {}
