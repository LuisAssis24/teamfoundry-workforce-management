package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.AdminLoginRequest;
import com.teamfoundry.backend.account.dto.AdminLoginResponse;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.service.AdminAuthenticationService;
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
public class AdminLoginController {

    private final AdminAuthenticationService adminAuthenticationService;

    public AdminLoginController(AdminAuthenticationService adminAuthenticationService) {
        this.adminAuthenticationService = adminAuthenticationService;
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequest request) {
        return adminAuthenticationService
                .authenticate(request.getUsername(), request.getPassword())
                .<ResponseEntity<?>>map(this::buildSuccessResponse)
                .orElseGet(this::buildUnauthorizedResponse);
    }

    private ResponseEntity<AdminLoginResponse> buildSuccessResponse(UserType role) {
        return ResponseEntity.ok(new AdminLoginResponse(role));
    }

    private ResponseEntity<ApiErrorResponse> buildUnauthorizedResponse() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.of(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }
}
