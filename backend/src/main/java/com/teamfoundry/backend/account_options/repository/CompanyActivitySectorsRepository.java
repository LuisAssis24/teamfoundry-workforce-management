package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account_options.model.CompanyActivitySectors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyActivitySectorsRepository extends JpaRepository<CompanyActivitySectors, Integer> {
    void deleteByCompany(CompanyAccount company);
}
