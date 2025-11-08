package com.teamfoundry.backend.security.service;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.model.AdminAccount;
import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AdminAccountRepository;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.security.dto.LoginRequest;
import com.teamfoundry.backend.security.dto.LoginResponse;
import com.teamfoundry.backend.security.dto.RefreshRequest;
import com.teamfoundry.backend.security.model.AuthToken;
import com.teamfoundry.backend.security.model.PasswordResetToken;
import com.teamfoundry.backend.security.repository.AuthTokenRepository;
import com.teamfoundry.backend.security.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminAccountRepository adminAccountRepository;
    private final CompanyAccountRepository companyAccountRepository;
    private final EmployeeAccountRepository employeeAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        String identifier = request.email().trim();
        String normalizedEmail = identifier.toLowerCase();

        log.info("Tentativa de login recebida para {}", identifier);

        Optional<LoginResponse> admin = adminAccountRepository.findByUsernameIgnoreCase(identifier)
                .map(account -> validateAdmin(account, request.password()));

        if (admin.isPresent()) {
            return admin.get();
        }

        Optional<LoginResponse> company = companyAccountRepository.findByEmail(normalizedEmail)
                .map(account -> validateAccount(account, request.password()));
        if (company.isPresent()) {
            return company.get();
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest req) {
        try{
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        }catch(AuthenticationException e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Optional<LoginResponse> employee = employeeAccountRepository.findByEmail(normalizedEmail)
                .map(account -> validateEmployee(account, request.password()));
        if (employee.isPresent()) {
            return employee.get();
        }

        log.warn("Login falhou para {}: utilizador não encontrado", identifier);
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
    }

    private LoginResponse validateAdmin(AdminAccount adminAccount, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, adminAccount.getPassword())) {
            log.warn("Password incorreta para administrador {}", adminAccount.getUsername());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        return new LoginResponse(UserType.ADMIN.name(), "Login efetuado com sucesso");
    }

    private LoginResponse validateAccount(Account account, String rawPassword) {
        ensurePasswordMatches(account, rawPassword);
        ensureAccountIsActive(account);
        return new LoginResponse(account.getRole().name(), "Login efetuado com sucesso");
    }

    private LoginResponse validateEmployee(EmployeeAccount employeeAccount, String rawPassword) {
        ensurePasswordMatches(employeeAccount, rawPassword);
        ensureAccountIsActive(employeeAccount);
        return new LoginResponse(employeeAccount.getRole().name(), "Login efetuado com sucesso");
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
        // Always respond the same to avoid user enumeration
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token"));
        if (prt.getExpireAt().before(Timestamp.from(Instant.now()))) {
            passwordResetTokenRepository.delete(prt);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token expired");
        }

        var user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(user);

        // Invalidate used token(s)
        passwordResetTokenRepository.deleteByUser(user);
    }
}
