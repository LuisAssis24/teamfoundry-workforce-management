package com.teamfoundry.backend.jobs.repository;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.jobs.enums.JobSource;
import com.teamfoundry.backend.jobs.enums.JobStatus;
import com.teamfoundry.backend.jobs.model.CandidateJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateJobRepository extends JpaRepository<CandidateJob, Integer> {

    Page<CandidateJob> findByEmployee(EmployeeAccount employee, Pageable pageable);

    Page<CandidateJob> findByEmployeeAndStatus(EmployeeAccount employee, JobStatus status, Pageable pageable);

    Page<CandidateJob> findByEmployeeAndSource(EmployeeAccount employee, JobSource source, Pageable pageable);

    boolean existsByIdAndEmployee(Integer id, EmployeeAccount employee);
}
