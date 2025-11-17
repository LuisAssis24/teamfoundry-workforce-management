package com.teamfoundry.backend.site.dto;

import jakarta.validation.constraints.NotNull;

public record ToggleVisibilityRequest(
        @NotNull
        Boolean active
) {}
