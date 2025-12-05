package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.employee.EmployeeGeoArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeGeoAreaRepository extends JpaRepository<EmployeeGeoArea, Integer> {
    void deleteByEmployee(EmployeeAccount employee);

    List<EmployeeGeoArea> findByEmployee(EmployeeAccount employee);
}
