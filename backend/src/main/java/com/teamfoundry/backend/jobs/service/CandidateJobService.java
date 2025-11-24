package com.teamfoundry.backend.jobs.service;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.jobs.dto.CandidateJobRequest;
import com.teamfoundry.backend.jobs.dto.CandidateJobResponse;
import com.teamfoundry.backend.jobs.enums.JobSource;
import com.teamfoundry.backend.jobs.enums.JobStatus;
import com.teamfoundry.backend.jobs.model.CandidateJob;
import com.teamfoundry.backend.jobs.repository.CandidateJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateJobService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final CandidateJobRepository candidateJobRepository;

    @Value("${app.candidate.payslips-upload-dir:uploads/payslips}")
    private String payslipsUploadDir;

    @Transactional(readOnly = true)
    public Page<CandidateJobResponse> listJobs(String email, String statusParam, int page, int size) {
        EmployeeAccount account = resolveAccount(email);
        JobStatus statusFilter = parseStatus(statusParam);

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                clampSize(size),
                Sort.by(Sort.Direction.DESC, "endDate").and(Sort.by(Sort.Direction.DESC, "id"))
        );

        Page<CandidateJob> result = statusFilter != null
                ? candidateJobRepository.findByEmployeeAndStatus(account, statusFilter, pageable)
                : candidateJobRepository.findByEmployee(account, pageable);

        return result.map(this::toResponse);
    }

    @Transactional
    public CandidateJobResponse createManualJob(String email, CandidateJobRequest request) {
        EmployeeAccount account = resolveAccount(email);
        validateDates(request.getStartDate(), request.getEndDate());

        CandidateJob job = new CandidateJob();
        job.setEmployee(account);
        job.setSource(JobSource.MANUAL);
        applyRequest(job, request, true);

        CandidateJob saved = candidateJobRepository.save(job);
        return toResponse(saved);
    }

    @Transactional
    public CandidateJobResponse updateManualJob(Integer jobId, String email, CandidateJobRequest request) {
        EmployeeAccount account = resolveAccount(email);
        CandidateJob job = candidateJobRepository.findById(jobId)
                .filter(existing -> existing.getEmployee().getId().equals(account.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Experiência não encontrada."));

        if (job.getSource() != JobSource.MANUAL) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Só é possível editar experiências manuais.");
        }

        validateDates(request.getStartDate(), request.getEndDate());
        applyRequest(job, request, false);

        CandidateJob saved = candidateJobRepository.save(job);
        return toResponse(saved);
    }

    @Transactional
    public void deleteManualJob(Integer jobId, String email) {
        EmployeeAccount account = resolveAccount(email);
        CandidateJob job = candidateJobRepository.findById(jobId)
                .filter(existing -> existing.getEmployee().getId().equals(account.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Experiência não encontrada."));

        if (job.getSource() != JobSource.MANUAL) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Experiências atribuídas por empresas não podem ser removidas.");
        }

        deleteFileIfExists(job.getPayslipUrl());
        candidateJobRepository.delete(job);
    }

    private void applyRequest(CandidateJob job, CandidateJobRequest request, boolean isCreate) {
        job.setCompanyName(request.getCompanyName().trim());
        job.setRole(request.getRole().trim());
        job.setLocation(trimToNull(request.getLocation()));
        job.setStartDate(request.getStartDate());
        job.setEndDate(request.getEndDate());
        job.setPayRate(normalizePayRate(request.getPayRate()));
        job.setPayUnit(request.getPayUnit());
        job.setEvaluation(request.getEvaluation());
        job.setStatus(request.getStatus() != null ? request.getStatus() : JobStatus.COMPLETED);

        if (StringUtils.hasText(request.getPayslipFile())) {
            String storedPath = storePayslip(job.getEmployee().getId(), request.getPayslipFile(), request.getPayslipFileName());
            deleteFileIfExists(job.getPayslipUrl());
            job.setPayslipUrl(storedPath);
        } else if (isCreate) {
            job.setPayslipUrl(null);
        }
    }

    private CandidateJobResponse toResponse(CandidateJob job) {
        return CandidateJobResponse.builder()
                .id(job.getId())
                .companyName(job.getCompanyName())
                .role(job.getRole())
                .location(job.getLocation())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .payRate(job.getPayRate())
                .payUnit(job.getPayUnit())
                .evaluation(job.getEvaluation())
                .payslipUrl(job.getPayslipUrl())
                .status(job.getStatus())
                .source(job.getSource())
                .build();
    }

    private EmployeeAccount resolveAccount(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilizador não autenticado.");
        }
        return employeeAccountRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta não encontrada."));
    }

    private JobStatus parseStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return JobStatus.COMPLETED;
        }
        try {
            return JobStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status inválido: " + status);
        }
    }

    private void validateDates(LocalDate start, LocalDate end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de fim não pode ser anterior à data de início.");
        }
    }

    private int clampSize(int size) {
        if (size <= 0) return 10;
        return Math.min(size, 50);
    }

    private String storePayslip(Integer employeeId, String payload, String originalName) {
        try {
            String base64 = extractBase64Content(payload);
            byte[] data = Base64.getDecoder().decode(base64);

            Path uploadDir = Paths.get(payslipsUploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String extension = resolveExtension(originalName);
            String filename = "payslip_" + employeeId + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadDir.resolve(filename);

            Files.write(filePath, data, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            return filePath.toString();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O comprovativo enviado é inválido.");
        } catch (IOException ex) {
            log.error("Erro ao guardar comprovativo de pagamento para funcionario {}", employeeId, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível guardar o comprovativo.");
        }
    }

    private void deleteFileIfExists(String storedPath) {
        if (!StringUtils.hasText(storedPath)) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(storedPath));
        } catch (IOException ex) {
            log.warn("Falha ao remover comprovativo {}: {}", storedPath, ex.getMessage());
        }
    }

    private String extractBase64Content(String raw) {
        int commaIndex = raw.indexOf(',');
        return commaIndex >= 0 ? raw.substring(commaIndex + 1) : raw;
    }

    private String resolveExtension(String originalName) {
        if (StringUtils.hasText(originalName) && originalName.contains(".")) {
            return originalName.substring(originalName.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        }
        return ".pdf";
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private BigDecimal normalizePayRate(BigDecimal value) {
        if (value == null) {
            return null;
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
