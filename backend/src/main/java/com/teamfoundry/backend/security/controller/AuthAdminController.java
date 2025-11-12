package com.teamfoundry.backend.security.controller;

import com.teamfoundry.backend.account.dto.login.AdminLoginRequest;
import com.teamfoundry.backend.account.dto.login.AdminLoginResponse;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.security.service.AdminAuthService;
import com.teamfoundry.backend.common.dto.ApiErrorResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller que expoe o endpoint de login de administrador com validacao via hash no banco.
 */
@RestController
@RequestMapping("/api/admin")
public class AuthAdminController {

    private final AdminAuthService adminAuthenticationService;

    public AuthAdminController(AdminAuthService adminAuthenticationService) {
        this.adminAuthenticationService = adminAuthenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequest request) {
        return adminAuthenticationService.authenticate(request.getUsername(), request.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(this::buildUnauthorizedResponse);
    }


    private ResponseEntity<ApiErrorResponse> buildUnauthorizedResponse() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.of(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }
}
