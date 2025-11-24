package com.teamfoundry.backend.jobs.model;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.jobs.enums.JobSource;
import com.teamfoundry.backend.jobs.enums.JobStatus;
import com.teamfoundry.backend.jobs.enums.PayUnit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "candidate_jobs")
public class CandidateJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private EmployeeAccount employee;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 150)
    private String role;

    @Column(length = 150)
    private String location;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "pay_rate", precision = 10, scale = 2)
    private BigDecimal payRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_unit", length = 10)
    private PayUnit payUnit;

    @Column
    private Integer evaluation;

    @Column(name = "payslip_url")
    private String payslipUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private JobStatus status = JobStatus.COMPLETED;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private JobSource source = JobSource.ASSIGNMENT;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PrePersist
    public void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
