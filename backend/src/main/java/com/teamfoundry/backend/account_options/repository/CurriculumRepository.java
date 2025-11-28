package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.EmployeeCurriculum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CurriculumRepository extends JpaRepository<EmployeeCurriculum, Integer> {
    Optional<EmployeeCurriculum> findByEmployee(EmployeeAccount employee);
    void deleteByEmployee(EmployeeAccount employee);
}
