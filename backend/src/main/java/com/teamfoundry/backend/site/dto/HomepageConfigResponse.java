package com.teamfoundry.backend.site.dto;

import java.util.List;

public record HomepageConfigResponse(
        List<HomepageSectionResponse> sections,
        List<IndustryShowcaseResponse> industries,
        List<PartnerShowcaseResponse> partners
) {}
