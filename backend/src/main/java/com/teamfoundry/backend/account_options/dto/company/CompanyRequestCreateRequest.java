package com.teamfoundry.backend.account_options.dto.company;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Pedido para criar uma nova requisição de equipa pela empresa autenticada.
 */
@Data
public class CompanyRequestCreateRequest {

    @NotBlank
    @Size(min = 3, max = 150)
    private String teamName;

    @Size(max = 500)
    private String description;

    @Size(max = 150)
    private String location;

    @FutureOrPresent(message = "A data de início não pode estar no passado.")
    private LocalDateTime startDate;

    @FutureOrPresent(message = "A data de fim não pode estar no passado.")
    private LocalDateTime endDate;
}
