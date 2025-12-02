package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.model.EmployeeRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface EmployeeRequestRepository extends JpaRepository<EmployeeRequest, Integer> {

    @EntityGraph(attributePaths = {"teamRequest", "teamRequest.company"})
    List<EmployeeRequest> findByEmployee_EmailOrderByAcceptedDateDesc(String email);

    @EntityGraph(attributePaths = {"teamRequest", "teamRequest.company"})
    List<EmployeeRequest> findByEmployeeIsNullOrderByCreatedAtDesc();

    @Query("""
            SELECT er.teamRequest.id AS requestId, COUNT(er) AS total
            FROM EmployeeRequest er
            WHERE er.teamRequest.id IN :requestIds
            GROUP BY er.teamRequest.id
            """)
    List<TeamRequestCount> countByTeamRequestIds(@Param("requestIds") Collection<Integer> requestIds);

    @Query("""
            SELECT er.requestedRole AS role, COUNT(er) AS total, COUNT(er.employee) AS filled
            FROM EmployeeRequest er
            WHERE er.teamRequest.id = :teamRequestId
            GROUP BY er.requestedRole
            """)
    List<RoleCount> countByRoleForTeam(@Param("teamRequestId") Integer teamRequestId);

    interface TeamRequestCount {
        Integer getRequestId();
        long getTotal();
    }

    interface RoleCount {
        String getRole();
        long getTotal();
        long getFilled();
    }
}
