package com.teamfoundry.backend.admin.repository;

import com.teamfoundry.backend.admin.model.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRequestRepository extends JpaRepository<TeamRequest, Integer> {
}
