package com.teamfoundry.backend.account_options.dto.employee;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class EmployeeCertificationResponse {
    int id;
    String name;
    String institution;
    String location;
    LocalDate completionDate;
    String description;
    String certificateUrl;
}
