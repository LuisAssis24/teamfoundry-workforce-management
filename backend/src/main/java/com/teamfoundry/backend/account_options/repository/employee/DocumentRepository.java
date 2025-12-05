package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account_options.enums.DocumentType;
import com.teamfoundry.backend.account_options.model.employee.EmployeeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<EmployeeDocument, Integer> {
    Optional<EmployeeDocument> findByEmployeeAndType(EmployeeAccount employee, DocumentType type);

    List<EmployeeDocument> findAllByEmployee(EmployeeAccount employee);
}
