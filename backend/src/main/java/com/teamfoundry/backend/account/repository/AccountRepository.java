package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(UserType role);
}

