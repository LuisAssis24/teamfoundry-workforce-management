package com.teamfoundry.backend.account.dto.Employee;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class EmployeeProfileResponse {
    String firstName;
    String lastName;
    String gender;
    LocalDate birthDate;
    String nationality;
    Integer nif;
    String phone;
    String email;
}