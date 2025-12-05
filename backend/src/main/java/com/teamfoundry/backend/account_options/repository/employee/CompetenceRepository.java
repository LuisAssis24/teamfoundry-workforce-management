package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account_options.model.employee.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetenceRepository extends JpaRepository<Competence, Integer> {
    Optional<Competence> findByName(String name);

    Optional<Competence> findByNameIgnoreCase(String name);
}
