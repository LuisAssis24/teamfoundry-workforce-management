package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.CandidateProfileResponse;
import com.teamfoundry.backend.account.dto.CandidateProfileUpdateRequest;
import com.teamfoundry.backend.account.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/candidate/profile", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    @GetMapping
    public CandidateProfileResponse getProfile(Authentication authentication) {
        return candidateProfileService.getProfile(resolveEmail(authentication));
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public CandidateProfileResponse updateProfile(
            @Valid @RequestBody CandidateProfileUpdateRequest request,
            Authentication authentication) {
        return candidateProfileService.updateProfile(resolveEmail(authentication), request);
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return authentication.getName();
    }
}