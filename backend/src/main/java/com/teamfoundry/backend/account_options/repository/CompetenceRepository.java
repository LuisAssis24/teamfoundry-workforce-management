package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account_options.model.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetenceRepository extends JpaRepository<Competence, Integer> {
    Optional<Competence> findByName(String name);
}
