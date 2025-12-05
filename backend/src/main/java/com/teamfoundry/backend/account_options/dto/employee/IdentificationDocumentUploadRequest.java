package com.teamfoundry.backend.account_options.dto.employee;

import com.teamfoundry.backend.account_options.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdentificationDocumentUploadRequest {

    @NotBlank
    private String file;

    @NotBlank
    private String fileName;

    @NotNull
    private DocumentType type;
}
