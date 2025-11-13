package com.teamfoundry.backend.account.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class CandidateCertificationResponse {
    int id;
    String name;
    String institution;
    String location;
    LocalDate completionDate;
    String description;
    String certificateUrl;
}
