package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.CompanyAccountManager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyAccountOwnerRepository extends JpaRepository<CompanyAccountManager, Integer> {
    boolean existsByEmailIgnoreCase(String email);
}
