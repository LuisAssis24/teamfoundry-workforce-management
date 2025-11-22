package com.teamfoundry.backend.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record HomeLoginMetricRequest(
        @NotBlank @Size(max = 120) String label,
        @NotBlank @Size(max = 60) String value,
        @Size(max = 500) String description,
        Boolean active
) {
}
