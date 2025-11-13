package com.teamfoundry.backend.jobs.dto;

import com.teamfoundry.backend.jobs.enums.JobSource;
import com.teamfoundry.backend.jobs.enums.JobStatus;
import com.teamfoundry.backend.jobs.enums.PayUnit;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDate;

@Value
@Builder
public class CandidateJobResponse {
    Integer id;
    String companyName;
    String role;
    String location;
    LocalDate startDate;
    LocalDate endDate;
    BigDecimal payRate;
    PayUnit payUnit;
    Integer evaluation;
    String payslipUrl;
    JobStatus status;
    JobSource source;
}
