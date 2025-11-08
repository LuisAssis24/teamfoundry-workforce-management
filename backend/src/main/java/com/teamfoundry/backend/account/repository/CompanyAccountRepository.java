package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.CompanyAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyAccountRepository extends JpaRepository<CompanyAccount, Integer> {
    Optional<CompanyAccount> findByEmail(String email);
}
