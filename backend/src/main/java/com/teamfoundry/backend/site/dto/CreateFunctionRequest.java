package com.teamfoundry.backend.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFunctionRequest(
        @NotBlank @Size(max = 120) String name
) {
}
