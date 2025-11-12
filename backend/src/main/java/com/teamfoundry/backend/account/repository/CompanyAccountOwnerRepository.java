package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.CompanyAccountOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyAccountOwnerRepository extends JpaRepository<CompanyAccountOwner, Integer> {
    boolean existsByEmailIgnoreCase(String email);
}
