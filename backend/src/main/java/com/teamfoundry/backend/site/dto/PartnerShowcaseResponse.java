package com.teamfoundry.backend.site.dto;

public record PartnerShowcaseResponse(
        Long id,
        String name,
        String description,
        String imageUrl,
        String websiteUrl,
        boolean active,
        int displayOrder
) {}
