package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.model.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeamRequestRepository extends JpaRepository<TeamRequest, Integer> {

    List<TeamRequest> findByState(State state);

    long countByState(State state);

    List<TeamRequest> findByResponsibleAdminId(Integer adminId);

    @Query("""
            SELECT tr.responsibleAdminId AS adminId, COUNT(tr) AS total
            FROM TeamRequest tr
            WHERE tr.responsibleAdminId IS NOT NULL
            GROUP BY tr.responsibleAdminId
            """)
    List<AdminAssignmentCount> countAssignmentsGroupedByAdmin();

    interface AdminAssignmentCount {
        Integer getAdminId();
        long getTotal();
    }
}
