package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.model.EmployeeRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRequestRepository extends JpaRepository<EmployeeRequest, Integer> {

    /**
     * Busca requisições já associadas ao colaborador, ordenadas por data de aceitação.
     */
    @EntityGraph(attributePaths = {"teamRequest", "teamRequest.company"})
    List<EmployeeRequest> findByEmployee_EmailOrderByAcceptedDateDesc(String email);
}
