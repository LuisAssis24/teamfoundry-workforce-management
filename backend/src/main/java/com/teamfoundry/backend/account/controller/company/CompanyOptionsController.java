package com.teamfoundry.backend.account.controller.company;

import com.teamfoundry.backend.account.dto.company.CompanyOptionsResponse;
import com.teamfoundry.backend.account.service.CompanyOptionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company/options")
@RequiredArgsConstructor
public class CompanyOptionsController {

    private final CompanyOptionsService companyOptionsService;

    @GetMapping
    public ResponseEntity<CompanyOptionsResponse> listOptions() {
        return ResponseEntity.ok(companyOptionsService.loadOptions());
    }
}
