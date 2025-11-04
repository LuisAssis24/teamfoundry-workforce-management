package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Servico responsavel por autenticar administradores usando hash BCrypt.
 */
@Service
@Transactional(readOnly = true)
public class AdminAuthenticationService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthenticationService(AdminAccountRepository adminAccountRepository,
                                      PasswordEncoder passwordEncoder) {
        this.adminAccountRepository = adminAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<UserType> authenticate(String username, String rawPassword) {
        return adminAccountRepository.findByUsername(username)
                .filter(account -> passwordMatches(rawPassword, account))
                .map(AdminAccount::getRole);
    }

    private boolean passwordMatches(String rawPassword, AdminAccount account) {
        return passwordEncoder.matches(rawPassword, account.getPassword());
    }
}
