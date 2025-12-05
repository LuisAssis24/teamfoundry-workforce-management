package com.teamfoundry.backend.account_options.repository.employee;

import com.teamfoundry.backend.account_options.model.employee.Function;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FunctionRepository extends JpaRepository<Function, Integer> {
    Optional<Function> findByName(String name);
}
