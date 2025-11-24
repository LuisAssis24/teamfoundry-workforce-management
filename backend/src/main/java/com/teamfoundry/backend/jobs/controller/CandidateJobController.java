package com.teamfoundry.backend.jobs.controller;

import com.teamfoundry.backend.jobs.dto.CandidateJobRequest;
import com.teamfoundry.backend.jobs.dto.CandidateJobResponse;
import com.teamfoundry.backend.jobs.service.CandidateJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/candidate/jobs", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CandidateJobController {

    private final CandidateJobService candidateJobService;

    @GetMapping
    public Page<CandidateJobResponse> listJobs(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Authentication authentication
    ) {
        return candidateJobService.listJobs(resolveEmail(authentication), status, page, size);
    }

    @PostMapping(value = "/manual", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CandidateJobResponse> createManualJob(
            @Valid @RequestBody CandidateJobRequest request,
            Authentication authentication
    ) {
        CandidateJobResponse response = candidateJobService.createManualJob(resolveEmail(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/manual/{jobId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public CandidateJobResponse updateManualJob(
            @PathVariable Integer jobId,
            @Valid @RequestBody CandidateJobRequest request,
            Authentication authentication
    ) {
        return candidateJobService.updateManualJob(jobId, resolveEmail(authentication), request);
    }

    @DeleteMapping("/manual/{jobId}")
    public ResponseEntity<Void> deleteManualJob(
            @PathVariable Integer jobId,
            Authentication authentication
    ) {
        candidateJobService.deleteManualJob(jobId, resolveEmail(authentication));
        return ResponseEntity.noContent().build();
    }

    private String resolveEmail(Authentication authentication) {
        return authentication != null ? authentication.getName() : null;
    }
}
