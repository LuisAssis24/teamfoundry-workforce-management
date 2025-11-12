package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.credentials.CompanyApprovalRequest;
import com.teamfoundry.backend.account.dto.credentials.CompanyCredentialResponse;
import com.teamfoundry.backend.account.service.CompanyCredentialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/companies/{id}/approve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void approveCompany(@PathVariable int id,
                               @Valid @RequestBody CompanyApprovalRequest request) {
        companyCredentialService.approveCompanyCredential(id, request.superAdminPassword());
    }

    @PostMapping("/companies/{id}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void rejectCompany(@PathVariable int id,
                              @Valid @RequestBody CompanyApprovalRequest request) {
        companyCredentialService.rejectCompanyCredential(id, request.superAdminPassword());
    }
}
