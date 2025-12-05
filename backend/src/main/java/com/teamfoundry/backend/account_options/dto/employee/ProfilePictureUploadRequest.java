package com.teamfoundry.backend.account_options.dto.employee;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfilePictureUploadRequest {

    @NotBlank
    private String file;

    @NotBlank
    private String fileName;
}
