package com.teamfoundry.backend.account_options.dto.employee;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CurriculumUploadRequest {
    /**
     * Conteúdo base64 do CV (pode incluir prefixo data-url).
     */
    @NotBlank
    private String file;

    /**
     * Nome original do ficheiro (para deduzir extensão).
     */
    @NotBlank
    private String fileName;
}
