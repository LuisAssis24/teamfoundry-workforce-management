package com.teamfoundry.backend.security.repository;

import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.security.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUserAndToken(Account user, String token);
    void deleteByToken(String token);
    void deleteByUser(Account user);
}

