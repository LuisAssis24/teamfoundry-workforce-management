package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialRequest;
import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialResponse;
import com.teamfoundry.backend.superadmin.dto.credential.AdminCredentialUpdateRequest;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Camada responsável por listar, criar e atualizar administradores.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminCredentialService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminCredentialResponse> listAdminCredentials() {
        return adminAccountRepository
                .findAll(Sort.by(Sort.Direction.ASC, "username"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminCredentialResponse createAdmin(AdminCredentialRequest request) {
        adminAccountRepository.findByUsername(request.username()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username já utilizado");
        });

        AdminAccount admin = new AdminAccount();
        admin.setUsername(request.username());
        admin.setRole(request.role());
        admin.setPassword(passwordEncoder.encode(request.password()));

        AdminAccount saved = adminAccountRepository.save(admin);
        return toResponse(saved);
    }

    @Transactional
    public AdminCredentialResponse updateAdmin(int id, AdminCredentialUpdateRequest request) {
        AdminAccount admin = adminAccountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrador não encontrado"));

        adminAccountRepository.findByUsername(request.username())
                .filter(existing -> existing.getId() != id)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Username já utilizado");
                });

        admin.setUsername(request.username());
        admin.setRole(request.role());

        if (request.password() != null && !request.password().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.password()));
        }

        AdminAccount saved = adminAccountRepository.save(admin);
        return toResponse(saved);
    }

    private AdminCredentialResponse toResponse(AdminAccount admin) {
        return new AdminCredentialResponse(admin.getId(), admin.getUsername(), admin.getRole());
    }
}
