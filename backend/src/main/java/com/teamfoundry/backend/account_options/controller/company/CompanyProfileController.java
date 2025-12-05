package com.teamfoundry.backend.account_options.controller.company;

import com.teamfoundry.backend.account_options.dto.company.CompanyManagerUpdateRequest;
import com.teamfoundry.backend.account_options.dto.company.CompanyProfileResponse;
import com.teamfoundry.backend.account_options.service.company.CompanyProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints de perfil da empresa autenticada.
 */
@RestController
@RequestMapping(value = "/api/company/profile", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    /**
     * Devolve os dados básicos da empresa (read-only) e do responsável (editável).
     */
    @GetMapping
    public CompanyProfileResponse getProfile(Authentication authentication) {
        return companyProfileService.getProfile(resolveEmail(authentication));
    }

    /**
     * Atualiza dados do responsável pela conta.
     */
    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public CompanyProfileResponse updateManager(
            @Valid @RequestBody CompanyManagerUpdateRequest request,
            Authentication authentication) {
        return companyProfileService.updateManager(resolveEmail(authentication), request);
    }

    private String resolveEmail(Authentication authentication) {
        return authentication != null ? authentication.getName() : null;
    }
}
