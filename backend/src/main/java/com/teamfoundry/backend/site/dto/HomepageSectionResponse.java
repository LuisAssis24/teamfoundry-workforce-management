package com.teamfoundry.backend.site.dto;

import com.teamfoundry.backend.site.enums.SiteSectionType;

public record HomepageSectionResponse(
        Long id,
        SiteSectionType type,
        boolean active,
        int displayOrder,
        String title,
        String subtitle,
        String primaryCtaLabel,
        String primaryCtaUrl,
        String secondaryCtaLabel,
        String secondaryCtaUrl
) {}
