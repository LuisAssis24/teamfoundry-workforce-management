package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.employee.EmployeeFunction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeFunctionRepository extends JpaRepository<EmployeeFunction, Integer> {
    void deleteByEmployee(EmployeeAccount employee);

    Optional<EmployeeFunction> findFirstByEmployee(EmployeeAccount employee);
}
