package com.teamfoundry.backend.account_options.dto.company;

import java.util.List;

public record CompanyOptionsResponse(
        List<String> activitySectors,
        List<String> countries
) {}
