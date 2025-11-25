package com.teamfoundry.backend.site.dto;

import java.util.List;

public record WeeklyTipsPageResponse(
        WeeklyTipResponse tipOfWeek,
        List<WeeklyTipResponse> tips
) {
}

