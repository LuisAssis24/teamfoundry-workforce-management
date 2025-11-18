package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.model.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRequestRepository extends JpaRepository<TeamRequest, Integer> {

    List<TeamRequest> findByState(State state);

    long countByState(State state);
}
