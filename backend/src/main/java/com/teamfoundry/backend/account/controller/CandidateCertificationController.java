package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.CandidateCertificationRequest;
import com.teamfoundry.backend.account.dto.CandidateCertificationResponse;
import com.teamfoundry.backend.account.service.CandidateCertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/candidate/education", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CandidateCertificationController {

    private final CandidateCertificationService certificationService;

    @GetMapping
    public List<CandidateCertificationResponse> list(Authentication authentication) {
        return certificationService.list(resolveEmail(authentication));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CandidateCertificationResponse> create(
            @Valid @RequestBody CandidateCertificationRequest request,
            Authentication authentication
    ) {
        CandidateCertificationResponse response = certificationService.create(resolveEmail(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{certificationId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public CandidateCertificationResponse update(
            @PathVariable int certificationId,
            @Valid @RequestBody CandidateCertificationRequest request,
            Authentication authentication
    ) {
        return certificationService.update(certificationId, resolveEmail(authentication), request);
    }

    @DeleteMapping("/{certificationId}")
    public ResponseEntity<Void> delete(
            @PathVariable int certificationId,
            Authentication authentication
    ) {
        certificationService.delete(certificationId, resolveEmail(authentication));
        return ResponseEntity.noContent().build();
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return authentication.getName();
    }
}
