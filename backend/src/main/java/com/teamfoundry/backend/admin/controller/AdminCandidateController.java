package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.dto.CandidateSearchResponse;
import com.teamfoundry.backend.admin.service.CandidateSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin/candidates")
@RequiredArgsConstructor
public class AdminCandidateController {

    private final CandidateSearchService candidateSearchService;

    @GetMapping("/search")
    public List<CandidateSearchResponse> search(
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "areas", required = false) List<String> areas,
            @RequestParam(name = "skills", required = false) List<String> skills
    ) {
        List<String> safeAreas = areas != null ? areas : Collections.emptyList();
        List<String> safeSkills = skills != null ? skills : Collections.emptyList();
        return candidateSearchService.search(role, safeAreas, safeSkills);
    }
}
