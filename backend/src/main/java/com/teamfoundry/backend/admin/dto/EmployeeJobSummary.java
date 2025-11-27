package com.teamfoundry.backend.admin.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class EmployeeJobSummary {
    int requestId;
    String teamName;
    String companyName;
    String location;
    String description;
    LocalDateTime startDate;
    LocalDateTime endDate;
    LocalDateTime acceptedDate;
    String requestedRole;
}
