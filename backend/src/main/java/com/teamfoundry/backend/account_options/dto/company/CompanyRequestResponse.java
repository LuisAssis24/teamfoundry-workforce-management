package com.teamfoundry.backend.account_options.dto.company;

import com.teamfoundry.backend.admin.enums.State;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Resposta simplificada de uma requisição criada pela empresa.
 */
@Data
@Builder
@AllArgsConstructor
public class CompanyRequestResponse {
    private Integer id;
    private String teamName;
    private String description;
    private String location;
    private State state;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    /**
     * Rótulo calculado para a UI (ACTIVE, PENDING, PAST).
     */
    private String computedStatus;
}
