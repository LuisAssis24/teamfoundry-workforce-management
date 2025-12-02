package com.teamfoundry.backend.admin.dto;

import java.util.List;

public record CandidateSearchResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String role,
        List<String> skills,
        List<String> areas,
        List<String> experiences
) {}
