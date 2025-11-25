package com.teamfoundry.backend.site.dto;

import java.time.LocalDate;

public record WeeklyTipResponse(
        Long id,
        String category,
        String title,
        String description,
        LocalDate publishedAt,
        boolean featured,
        boolean active,
        int displayOrder
) {
}

