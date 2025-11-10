package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.security.model.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);
    void deleteByToken(String token);
    Optional<AuthToken> findByUserAndToken(EmployeeAccount account, String token);
    default Optional<AuthToken> findByAccountAndCode(EmployeeAccount account, String code) {
        return findByUserAndToken(account, code);
    }
    void deleteAllByUser(EmployeeAccount account);
}
