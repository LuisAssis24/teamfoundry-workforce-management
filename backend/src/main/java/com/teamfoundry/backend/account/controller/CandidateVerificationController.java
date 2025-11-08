package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.GenericResponse;
import com.teamfoundry.backend.account.dto.VerificationResendRequest;
import com.teamfoundry.backend.account.service.CandidateRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints relacionados com a verificação via código (reenviar e validar).
 */
@RestController
@RequestMapping("/api/candidate/verification")
@RequiredArgsConstructor
public class CandidateVerificationController {

    private final CandidateRegistrationService candidateRegistrationService;

    /**
     * Reenvia o código de verificação para o e-mail indicado.
     */
    @PostMapping("/send")
    public ResponseEntity<GenericResponse> resend(@Valid @RequestBody VerificationResendRequest request) {
        return ResponseEntity.ok(candidateRegistrationService.resendVerificationCode(request));
    }
}
