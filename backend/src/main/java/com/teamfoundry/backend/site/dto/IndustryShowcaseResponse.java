package com.teamfoundry.backend.site.dto;

public record IndustryShowcaseResponse(
        Long id,
        String name,
        String description,
        String imageUrl,
        String linkUrl,
        boolean active,
        int displayOrder
) {}
