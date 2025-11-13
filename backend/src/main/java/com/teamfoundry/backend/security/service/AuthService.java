package com.teamfoundry.backend.security.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.security.dto.LoginRequest;
import com.teamfoundry.backend.security.dto.LoginResponse;
import com.teamfoundry.backend.security.dto.LoginResult;
import com.teamfoundry.backend.security.model.AuthToken;
import com.teamfoundry.backend.security.model.PasswordResetToken;
import com.teamfoundry.backend.security.repository.AuthTokenRepository;
import com.teamfoundry.backend.security.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private static final int REMEMBER_ME_DAYS = 30;

    private final AdminAccountRepository adminAccountRepository;
    private final CompanyAccountRepository companyAccountRepository;
    private final EmployeeAccountRepository employeeAccountRepository;
    private final AccountRepository accountRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenRepository authTokenRepository;
    private final JwtService jwtService;

    public LoginResult login(LoginRequest request) {
        String identifier = request.email().trim();
        String normalizedEmail = identifier.toLowerCase();
        boolean remember = Boolean.TRUE.equals(request.rememberMe());

        log.info("Tentativa de login recebida para {}", identifier);

        Optional<LoginResult> admin = adminAccountRepository.findByUsernameIgnoreCase(identifier)
                .map(account -> validateAdmin(account, request.password()));
        if (admin.isPresent()) {
            return admin.get();
        }

        Optional<LoginResult> company = companyAccountRepository.findByEmail(normalizedEmail)
                .map(account -> validateAccount(account, request.password(), remember));
        if (company.isPresent()) {
            return company.get();
        }

        Optional<LoginResult> employee = employeeAccountRepository.findByEmail(normalizedEmail)
                .map(account -> validateEmployee(account, request.password(), remember));
        if (employee.isPresent()) {
            return employee.get();
        }

        log.warn("Login falhou para {}: utilizador não encontrado", identifier);
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
    }

    private LoginResult validateAdmin(AdminAccount adminAccount, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, adminAccount.getPassword())) {
            log.warn("Password incorreta para administrador {}", adminAccount.getUsername());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        LoginResponse resp = new LoginResponse(UserType.ADMIN.name(), "Login efetuado com sucesso", null, 0);
        return new LoginResult(resp, null, 0);
    }

    private LoginResult validateAccount(Account account, String rawPassword, boolean remember) {
        ensurePasswordMatches(account, rawPassword);
        ensureAccountIsActive(account);
        String access = jwtService.generateToken(account.getEmail(), account.getRole().name(), account.getId());
        LoginResponse resp = new LoginResponse(account.getRole().name(), "Login efetuado com sucesso", access, jwtService.getExpirationSeconds());
        if (remember) {
            String refresh = issueRefreshToken(account, REMEMBER_ME_DAYS);
            return new LoginResult(resp, refresh, REMEMBER_ME_DAYS * 24 * 60 * 60);
        }
        return new LoginResult(resp, null, 0);
    }

    private LoginResult validateEmployee(EmployeeAccount employeeAccount, String rawPassword, boolean remember) {
        ensurePasswordMatches(employeeAccount, rawPassword);
        ensureAccountIsActive(employeeAccount);
        String access = jwtService.generateToken(employeeAccount.getEmail(), employeeAccount.getRole().name(), employeeAccount.getId());
        LoginResponse resp = new LoginResponse(employeeAccount.getRole().name(), "Login efetuado com sucesso", access, jwtService.getExpirationSeconds());
        if (remember) {
            String refresh = issueRefreshToken(employeeAccount, REMEMBER_ME_DAYS);
            return new LoginResult(resp, refresh, REMEMBER_ME_DAYS * 24 * 60 * 60);
        }
        return new LoginResult(resp, null, 0);
    }

    private String issueRefreshToken(Account user, int days) {
        AuthToken token = new AuthToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setCreatedAt(Timestamp.from(Instant.now()));
        token.setExpireAt(Timestamp.from(Instant.now().plus(days, ChronoUnit.DAYS)));
        authTokenRepository.save(token);
        return token.getToken();
    }

    private void ensurePasswordMatches(Account account, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, account.getPassword())) {
            log.warn("Password incorreta para {}", account.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }
    }

    private void ensureAccountIsActive(Account account) {
        if (!account.isActive()) {
            log.warn("Conta {} ainda não está ativa", account.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta ainda não foi verificada");
        }
    }

    public void requestPasswordReset(String email) {
        accountRepository.findByEmail(email).ifPresent(acc -> {
            // Clean previous tokens for this user (optional but tidy)
            passwordResetTokenRepository.deleteByUser(acc);

            PasswordResetToken prt = new PasswordResetToken();
            prt.setUser(acc);
            prt.setToken(UUID.randomUUID().toString());
            prt.setCreatedAt(Timestamp.from(Instant.now()));
            prt.setExpireAt(Timestamp.from(Instant.now().plus(1, ChronoUnit.HOURS)));
            passwordResetTokenRepository.save(prt);

            // No email service configured; log token for integration/testing
            LOGGER.info("Password reset token for {}: {} (expires in 1h)", acc.getEmail(), prt.getToken());
        });
    }

    public void resetPassword(String email, String code, String newPassword) {
        String normalizedEmail = email.trim().toLowerCase();
        var user = accountRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email not found"));

        PasswordResetToken prt = passwordResetTokenRepository.findByUserAndToken(user, code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token"));
        if (prt.getExpireAt().before(Timestamp.from(Instant.now()))) {
            passwordResetTokenRepository.delete(prt);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(user);

        // Invalidate used token(s)
        passwordResetTokenRepository.deleteByUser(user);
    }

    public LoginResponse refresh(String refreshToken) {
        var tokenOpt = authTokenRepository.findByToken(refreshToken);
        var token = tokenOpt.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido"));
        if (token.getExpireAt().before(Timestamp.from(Instant.now()))) {
            authTokenRepository.delete(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expirado");
        }

        Account user = token.getUser();
        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta inativa");
        }
        String access = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new LoginResponse(user.getRole().name(), "Token renovado", access, jwtService.getExpirationSeconds());
    }

    public void revokeRefresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) return;
        authTokenRepository.findByToken(refreshToken).ifPresent(authTokenRepository::delete);
    }
}
