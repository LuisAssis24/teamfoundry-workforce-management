package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.employee.EmployeeCompetence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeCompetenceRepository extends JpaRepository<EmployeeCompetence, Integer> {
    void deleteByEmployee(EmployeeAccount employee);

    List<EmployeeCompetence> findByEmployee(EmployeeAccount employee);
}
