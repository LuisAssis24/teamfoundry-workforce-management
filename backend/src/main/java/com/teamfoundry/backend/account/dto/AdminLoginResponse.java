package com.teamfoundry.backend.account.dto;

import com.teamfoundry.backend.account.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO retornado com o papel do administrador autenticado.
 */
@Data
@AllArgsConstructor
public class AdminLoginResponse {

    private UserType role;
}
