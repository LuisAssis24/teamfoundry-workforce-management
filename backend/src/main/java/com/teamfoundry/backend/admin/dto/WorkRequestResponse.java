package com.teamfoundry.backend.admin.dto;

import com.teamfoundry.backend.admin.enums.State;
import java.time.LocalDateTime;

public record WorkRequestResponse(
        int id,
        String companyName,
        String companyEmail,
        String teamName,
        String description,
        State state,
        Integer responsibleAdminId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        LocalDateTime createdAt
) {}
