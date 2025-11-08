package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Testes unitários do serviço de autenticação de administradores.
 */
@ExtendWith(MockitoExtension.class)
class AdminAuthenticationServiceTest {

    @Mock
    private AdminAccountRepository adminAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminAuthenticationService adminAuthenticationService;

    @Test
    @DisplayName("authenticate devolve role quando user e password são válidos")
    void authenticateReturnsRoleWhenPasswordMatches() {
        AdminAccount account = new AdminAccount(1, "admin", "hash", UserType.ADMIN);
        when(adminAccountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("secret", "hash")).thenReturn(true);

        Optional<UserType> result = adminAuthenticationService.authenticate("admin", "secret");

        assertThat(result).contains(UserType.ADMIN);
    }

    @Test
    @DisplayName("authenticate devolve vazio quando o hash não corresponde")
    void authenticateReturnsEmptyWhenPasswordDoesNotMatch() {
        AdminAccount account = new AdminAccount(1, "admin", "hash", UserType.ADMIN);
        when(adminAccountRepository.findByUsername("admin")).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("wrong", "hash")).thenReturn(false);

        Optional<UserType> result = adminAuthenticationService.authenticate("admin", "wrong");

        assertThat(result).isEmpty();
    }
}
