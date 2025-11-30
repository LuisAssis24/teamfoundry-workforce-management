package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.model.CompanyAccountManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyAccountOwnerRepository extends JpaRepository<CompanyAccountManager, Integer> {
    boolean existsByEmailIgnoreCase(String email);
    void deleteByCompanyAccount(CompanyAccount companyAccount);
    Optional<CompanyAccountManager> findByCompanyAccount_Email(String email);
}
