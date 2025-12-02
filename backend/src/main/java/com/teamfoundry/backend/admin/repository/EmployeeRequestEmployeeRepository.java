package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.model.EmployeeRequestEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRequestEmployeeRepository extends JpaRepository<EmployeeRequestEmployee, Integer> {

    @Query("""
            SELECT ere.employeeRequest.requestedRole AS role, COUNT(ere) AS total
            FROM EmployeeRequestEmployee ere
            WHERE ere.employeeRequest.teamRequest.id = :teamRequestId
            GROUP BY ere.employeeRequest.requestedRole
            """)
    List<RoleInviteCount> countInvitesByTeamRequest(@Param("teamRequestId") Integer teamRequestId);

    interface RoleInviteCount {
        String getRole();
        long getTotal();
    }
}
