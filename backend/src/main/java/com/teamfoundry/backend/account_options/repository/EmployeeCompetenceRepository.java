package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.EmployeeCompetence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeCompetenceRepository extends JpaRepository<EmployeeCompetence, Integer> {
    void deleteByEmployee(EmployeeAccount employee);
}
