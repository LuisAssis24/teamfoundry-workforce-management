package com.teamfoundry.backend.account.controller.Employee;

import com.teamfoundry.backend.account.dto.Employee.EmployeePreferencesResponse;
import com.teamfoundry.backend.account.dto.Employee.EmployeePreferencesUpdateRequest;
import com.teamfoundry.backend.account.service.CandidatePreferencesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/candidate/preferences", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class EmployeePreferencesController {

    private final CandidatePreferencesService candidatePreferencesService;

    @GetMapping
    public EmployeePreferencesResponse getPreferences(
            @RequestParam(name = "email", required = false) String requestEmail,
            Authentication authentication) {
        return candidatePreferencesService.getPreferences(resolveEmail(authentication, requestEmail));
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public EmployeePreferencesResponse updatePreferences(
            @Valid @RequestBody EmployeePreferencesUpdateRequest request,
            @RequestParam(name = "email", required = false) String requestEmail,
            Authentication authentication
    ) {
        return candidatePreferencesService.updatePreferences(resolveEmail(authentication, requestEmail), request);
    }

    private String resolveEmail(Authentication authentication, String fallbackEmail) {
        if (StringUtils.hasText(fallbackEmail)) {
            return fallbackEmail.trim().toLowerCase();
        }
        if (authentication != null && StringUtils.hasText(authentication.getName())) {
            return authentication.getName();
        }
        return null;
    }
}
