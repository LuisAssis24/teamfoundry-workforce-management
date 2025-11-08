package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.AdminCredentialRequest;
import com.teamfoundry.backend.account.dto.AdminCredentialResponse;
import com.teamfoundry.backend.account.dto.AdminCredentialUpdateRequest;
import com.teamfoundry.backend.account.service.AdminCredentialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints consumidos pelo painel de super admin para gerir credenciais administrativas.
 */
@RestController
@RequestMapping("/api/super-admin/credentials")
@RequiredArgsConstructor
public class AdminCredentialController {

    private final AdminCredentialService adminCredentialService;

    @GetMapping("/admins")
    public List<AdminCredentialResponse> listAdminCredentials() {
        return adminCredentialService.listAdminCredentials();
    }

    @PostMapping("/admins")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminCredentialResponse createAdmin(@Valid @RequestBody AdminCredentialRequest request) {
        return adminCredentialService.createAdmin(request);
    }

    @PutMapping("/admins/{id}")
    public AdminCredentialResponse updateAdmin(@PathVariable int id,
                                               @Valid @RequestBody AdminCredentialUpdateRequest request) {
        return adminCredentialService.updateAdmin(id, request);
    }
}
