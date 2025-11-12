package com.teamfoundry.backend.account.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class CandidateProfileResponse {
    String firstName;
    String lastName;
    String gender;
    LocalDate birthDate;
    String nationality;
    Integer nif;
    String phone;
    String email;
}