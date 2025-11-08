package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.AdminAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositorio para consultar administradores por username.
 */
public interface AdminAccountRepository extends JpaRepository<AdminAccount, Integer> {

    Optional<AdminAccount> findByUsername(String username);
    Optional<AdminAccount> findByUsernameIgnoreCase(String username);
}
