package com.teamfoundry.backend.superadmin.dto.work;

import jakarta.validation.constraints.NotNull;

public record AssignAdminRequest(
        @NotNull Integer adminId
) {}
