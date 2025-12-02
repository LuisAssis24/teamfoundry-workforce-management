package com.teamfoundry.backend.security.repository;

import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.security.model.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);
    void deleteByToken(String token);
    Optional<AuthToken> findByUserAndToken(Account account, String token);
    default Optional<AuthToken> findByAccountAndCode(Account account, String code) {
        return findByUserAndToken(account, code);
    }
    void deleteAllByUser(Account account);
}
