package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.credentials.CompanyApprovalRequest; // (se precisar em outro lugar)
import com.teamfoundry.backend.account.dto.credentials.CompanyCredentialResponse;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import com.teamfoundry.backend.account.enums.UserType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyCredentialService {

    private static final String ADMIN_TOKEN_PREFIX = "admin:";

    private final CompanyAccountRepository companyAccountRepository;
    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public List<CompanyCredentialResponse> listPendingCompanyCredentials() {
        return companyAccountRepository.findPendingCompanyCredentials();
    }

    @Transactional
    public void approveCompanyCredential(int companyId, String superAdminPassword) {
        validateSuperAdminPassword(superAdminPassword);

        CompanyAccount company = companyAccountRepository.findById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa não encontrada"));

        if (company.isStatus()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Empresa já aprovada.");
        }

        company.setStatus(true);
        companyAccountRepository.save(company);
    }

    @Transactional
    public void rejectCompanyCredential(int companyId, String superAdminPassword) {
        validateSuperAdminPassword(superAdminPassword);

        CompanyAccount company = companyAccountRepository.findById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa não encontrada"));

        companyAccountRepository.delete(company);
    }


    private void validateSuperAdminPassword(String rawPassword) {
        String sanitized = rawPassword == null ? "" : rawPassword.trim();
        if (sanitized.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password do super admin é obrigatória");
        }

        AdminAccount requester = resolveAuthenticatedAdmin();
        if (requester.getRole() != UserType.SUPERADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente super admins podem aprovar credenciais");
        }

        if (!passwordEncoder.matches(sanitized, requester.getPassword())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Password do super admin inválida");
        }
    }

    private AdminAccount resolveAuthenticatedAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticação requerida");
        }

        String principal = authentication.getName();
        if (principal == null || !principal.startsWith(ADMIN_TOKEN_PREFIX)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente super admins podem aprovar credenciais");
        }

        String username = principal.substring(ADMIN_TOKEN_PREFIX.length());
        return adminAccountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta do super admin não encontrada"));
    }
}
