package com.teamfoundry.backend.security.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Serviço dedicado ao login dos administradores utilizando hashes BCrypt.
 */
@Service
@Transactional(readOnly = true)
public class AdminAuthService {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthService(AdminAccountRepository adminAccountRepository,
                            PasswordEncoder passwordEncoder) {
        this.adminAccountRepository = adminAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<UserType> authenticate(String username, String rawPassword) {
        return adminAccountRepository.findByUsername(username)
                .filter(account -> passwordEncoder.matches(rawPassword, account.getPassword()))
                .map(AdminAccount::getRole);
    }
}
