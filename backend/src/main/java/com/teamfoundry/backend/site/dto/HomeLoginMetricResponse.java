package com.teamfoundry.backend.site.dto;

public record HomeLoginMetricResponse(
        Long id,
        String label,
        String value,
        String description,
        boolean active,
        int displayOrder
) {
}
