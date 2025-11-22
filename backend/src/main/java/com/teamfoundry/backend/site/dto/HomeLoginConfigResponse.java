package com.teamfoundry.backend.site.dto;

import java.util.List;

public record HomeLoginConfigResponse(
        List<HomeLoginSectionResponse> sections,
        List<HomeLoginMetricResponse> metrics
) {
}
