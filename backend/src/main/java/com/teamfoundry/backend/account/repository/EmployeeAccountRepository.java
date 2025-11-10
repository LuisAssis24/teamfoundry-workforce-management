package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeAccountRepository extends JpaRepository<EmployeeAccount, Integer> {
    Optional<EmployeeAccount> findByEmail(String email);
}
