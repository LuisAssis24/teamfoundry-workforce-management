package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.model.Certifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CertificationsRepository extends JpaRepository<Certifications, Integer> {

    List<Certifications> findByEmployeeOrderByCompletionDateDescIdDesc(EmployeeAccount employee);

    Optional<Certifications> findByIdAndEmployee(Integer id, EmployeeAccount employee);

    Optional<Certifications> findByEmployeeAndNameIgnoreCaseAndInstitutionIgnoreCaseAndCompletionDate(
            EmployeeAccount employee,
            String name,
            String institution,
            LocalDate completionDate
    );
}
