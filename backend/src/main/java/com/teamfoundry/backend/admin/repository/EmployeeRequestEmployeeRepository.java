package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.model.EmployeeRequestEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 * Ligações entre convites e vagas (EmployeeRequest).
 * Inclui contagem por função, desativação de convites e consultas por colaborador.
 */
public interface EmployeeRequestEmployeeRepository extends JpaRepository<EmployeeRequestEmployee, Integer> {

    @Query("""
            SELECT ere.employeeRequest.requestedRole AS role, COUNT(ere) AS total
            FROM EmployeeRequestEmployee ere
            WHERE ere.employeeRequest.teamRequest.id = :teamRequestId
              AND ere.active = true
            GROUP BY ere.employeeRequest.requestedRole
            """)
    List<RoleInviteCount> countInvitesByTeamRequest(@Param("teamRequestId") Integer teamRequestId);

    boolean existsByEmployeeRequest_IdAndEmployee_IdAndActiveTrue(int requestId, int employeeId);

    @Modifying
    @Query("""
            UPDATE EmployeeRequestEmployee ere
            SET ere.active = false
            WHERE ere.employeeRequest.id = :requestId
              AND ere.active = true
              AND (:acceptedId IS NULL OR ere.employee.id <> :acceptedId)
            """)
    int deactivateInvitesForRequest(@Param("requestId") int requestId,
                                    @Param("acceptedId") Integer acceptedId);

    @Query("""
            SELECT DISTINCT ere.employee.id
            FROM EmployeeRequestEmployee ere
            WHERE ere.employeeRequest.teamRequest.id = :teamId
              AND LOWER(ere.employeeRequest.requestedRole) = LOWER(:role)
              AND ere.active = true
            """)
    List<Integer> findActiveInviteEmployeeIdsByTeamAndRole(@Param("teamId") Integer teamId,
                                                           @Param("role") String role);

    @Query("""
            SELECT ere
            FROM EmployeeRequestEmployee ere
            JOIN FETCH ere.employeeRequest er
            JOIN FETCH er.teamRequest tr
            LEFT JOIN FETCH tr.company c
            WHERE LOWER(ere.employee.email) = LOWER(:email)
            """)
    List<EmployeeRequestEmployee> findAllInvitesByEmployeeEmail(@Param("email") String email);

    @Query("""
            SELECT ere
            FROM EmployeeRequestEmployee ere
            JOIN FETCH ere.employeeRequest er
            JOIN FETCH er.teamRequest tr
            JOIN FETCH tr.company c
            WHERE ere.active = true
              AND LOWER(ere.employee.email) = LOWER(:email)
            """)
    List<EmployeeRequestEmployee> findActiveInvitesByEmployeeEmail(@Param("email") String email);


    interface RoleInviteCount {
        String getRole();
        long getTotal();
    }
}
