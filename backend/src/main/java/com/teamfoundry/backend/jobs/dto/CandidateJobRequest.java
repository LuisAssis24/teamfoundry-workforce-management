package com.teamfoundry.backend.jobs.dto;

import com.teamfoundry.backend.jobs.enums.JobStatus;
import com.teamfoundry.backend.jobs.enums.PayUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CandidateJobRequest {

    @NotBlank
    @Size(max = 150)
    private String companyName;

    @NotBlank
    @Size(max = 150)
    private String role;

    @Size(max = 150)
    private String location;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @DecimalMin(value = "0.00", inclusive = true, message = "O valor de pagamento deve ser positivo.")
    private BigDecimal payRate;

    @NotNull
    private PayUnit payUnit;

    @Min(1)
    @Max(5)
    private Integer evaluation;

    private JobStatus status = JobStatus.COMPLETED;

    private String payslipFile;

    private String payslipFileName;
}
