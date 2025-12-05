package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.employee.EmployeeCertifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CertificationsRepository extends JpaRepository<EmployeeCertifications, Integer> {

    List<EmployeeCertifications> findByEmployeeOrderByCompletionDateDescIdDesc(EmployeeAccount employee);

    Optional<EmployeeCertifications> findByIdAndEmployee(Integer id, EmployeeAccount employee);

    Optional<EmployeeCertifications> findByEmployeeAndNameIgnoreCaseAndInstitutionIgnoreCaseAndCompletionDate(
            EmployeeAccount employee,
            String name,
            String institution,
            LocalDate completionDate
    );
}
