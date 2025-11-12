package com.teamfoundry.backend.superadmin.controller.credential;

import com.teamfoundry.backend.account.service.AdminCredentialService;
import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialRequest;
import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialResponse;
import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialUpdateRequest;
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
