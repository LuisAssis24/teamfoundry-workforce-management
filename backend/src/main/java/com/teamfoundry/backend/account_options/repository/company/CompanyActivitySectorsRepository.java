package com.teamfoundry.backend.account_options.repository.company;

import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account_options.model.company.CompanyActivitySectors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyActivitySectorsRepository extends JpaRepository<CompanyActivitySectors, Integer> {
    void deleteByCompany(CompanyAccount company);
}
