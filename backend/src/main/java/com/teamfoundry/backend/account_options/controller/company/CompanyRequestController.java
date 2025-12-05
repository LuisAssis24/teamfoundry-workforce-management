package com.teamfoundry.backend.account_options.controller.company;

import com.teamfoundry.backend.account_options.dto.company.CompanyRequestCreateRequest;
import com.teamfoundry.backend.account_options.dto.company.CompanyRequestResponse;
import com.teamfoundry.backend.account_options.service.company.CompanyRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints das requisições criadas pela empresa autenticada.
 */
@RestController
@RequestMapping(value = "/api/company/requests", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CompanyRequestController {

    private final CompanyRequestService companyRequestService;

    /**
     * Lista todas as requisições da empresa, já classificadas para uso em tabs.
     */
    @GetMapping
    public List<CompanyRequestResponse> list(Authentication authentication) {
        return companyRequestService.listCompanyRequests(resolveEmail(authentication));
    }

    /**
     * Cria uma nova requisição.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public CompanyRequestResponse create(
            @Valid @RequestBody CompanyRequestCreateRequest request,
            Authentication authentication) {
        return companyRequestService.createRequest(resolveEmail(authentication), request);
    }

    private String resolveEmail(Authentication authentication) {
        return authentication != null ? authentication.getName() : null;
    }
}
