package com.teamfoundry.backend.security.service;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.security.dto.AuthResponse;
import com.teamfoundry.backend.security.dto.LoginRequest;
import com.teamfoundry.backend.security.dto.RefreshRequest;
import com.teamfoundry.backend.security.model.AuthToken;
import com.teamfoundry.backend.security.repository.AuthTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.AuthenticationException;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    private final AuthTokenRepository authTokenRepository;

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
}
