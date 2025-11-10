package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.CompanyCredentialResponse;
import com.teamfoundry.backend.account.service.CompanyCredentialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/credentials")
@RequiredArgsConstructor
public class CompanyCredentialController {

    private final CompanyCredentialService companyCredentialService;

    @GetMapping("/companies")
    public List<CompanyCredentialResponse> listPendingCompanyCredentials() {
        return companyCredentialService.listPendingCompanyCredentials();
    }
}
