package com.teamfoundry.backend.admin.dto;

import com.teamfoundry.backend.admin.enums.State;

import java.time.LocalDateTime;

public record AssignedTeamRequestResponse(
        int id,
        String companyName,
        String companyEmail,
        String companyPhone,
        long workforceNeeded,
        State state,
        LocalDateTime createdAt
) {}
