package com.teamfoundry.backend.security.service;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.security.dto.AuthResponse;
import com.teamfoundry.backend.security.dto.LoginRequest;
import com.teamfoundry.backend.security.dto.RefreshRequest;
import com.teamfoundry.backend.security.model.AuthToken;
import com.teamfoundry.backend.security.model.PasswordResetToken;
import com.teamfoundry.backend.security.repository.AuthTokenRepository;
import com.teamfoundry.backend.security.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.AuthenticationException;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthService {
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

        Account acc = accountRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String access = jwtService.generateToken(acc.getEmail(), acc.getRole().name(), acc.getId());
        String refresh = UUID.randomUUID().toString();
        Timestamp now = Timestamp.from(Instant.now());
        Timestamp refreshExp = Timestamp.from(Instant.now().plus(30, ChronoUnit.DAYS));

        AuthToken at = new AuthToken();
        at.setUser(acc);
        at.setToken(refresh);
        at.setCreatedAt(now);
        at.setExpireAt(refreshExp);
        authTokenRepository.save(at);

        return new AuthResponse(access, refresh, jwtService.getExpirationSeconds(), acc.getRole().name());
    }

    public AuthResponse refresh(RefreshRequest req) {
        AuthToken token = authTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        if (token.getExpireAt().before(Timestamp.from(Instant.now()))) {
            authTokenRepository.delete(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }
        Account acc = token.getUser();
        String access = jwtService.generateToken(acc.getEmail(), acc.getRole().name(), acc.getId());
        return new AuthResponse(access, token.getToken(), jwtService.getExpirationSeconds(), acc.getRole().name());
    }

    public void logout(String refreshToken) {
        authTokenRepository.deleteByToken(refreshToken);
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
