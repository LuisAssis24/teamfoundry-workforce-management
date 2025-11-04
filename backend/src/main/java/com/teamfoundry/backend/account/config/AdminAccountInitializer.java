package com.teamfoundry.backend.account.config;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Popula a base com administradores padrao usando senha com hash BCrypt.
 */
@Configuration
public class AdminAccountInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminAccountInitializer.class);

    @Bean
    CommandLineRunner seedDefaultAdmins(AdminAccountRepository repository,
                                        PasswordEncoder passwordEncoder) {
        return args -> {
            createIfMissing(repository, passwordEncoder,
                    "admin", "admin123", UserType.ADMIN);
            createIfMissing(repository, passwordEncoder,
                    "superadmin", "super123", UserType.SUPERADMIN);
        };
    }

    private void createIfMissing(AdminAccountRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 String username,
                                 String rawPassword,
                                 UserType role) {
        repository.findByUsername(username).ifPresentOrElse(
                account -> LOGGER.debug("Admin {} already exists; skipping seed.", username),
                () -> {
                    String hashedPassword = passwordEncoder.encode(rawPassword);
                    AdminAccount account = new AdminAccount(0, username, hashedPassword, role);
                    repository.save(account);
                    LOGGER.info("Seeded admin {} with role {}.", username, role);
                }
        );
    }
}
