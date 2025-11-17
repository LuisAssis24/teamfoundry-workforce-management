package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.CandidateCertificationRequest;
import com.teamfoundry.backend.account.dto.CandidateCertificationResponse;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account_options.model.Certifications;
import com.teamfoundry.backend.account_options.repository.CertificationsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateCertificationService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final CertificationsRepository certificationsRepository;

    @Value("${app.candidate.certificates-upload-dir:uploads/certificates}")
    private String certificatesUploadDir;

    @Transactional(readOnly = true)
    public List<CandidateCertificationResponse> list(String email) {
        EmployeeAccount account = resolveAccount(email);
        return certificationsRepository.findByEmployeeOrderByCompletionDateDescIdDesc(account).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CandidateCertificationResponse create(String email, CandidateCertificationRequest request) {
        EmployeeAccount account = resolveAccount(email);
        ensureNotDuplicate(account, request, null);

        Certifications certification = new Certifications();
        certification.setEmployee(account);
        applyRequest(certification, request, true);

        Certifications saved = certificationsRepository.save(certification);
        return toResponse(saved);
    }

    @Transactional
    public CandidateCertificationResponse update(int certificationId,
                                                String email,
                                                CandidateCertificationRequest request) {
        EmployeeAccount account = resolveAccount(email);
        Certifications certification = certificationsRepository
                .findByIdAndEmployee(certificationId, account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formação não encontrada."));

        ensureNotDuplicate(account, request, certificationId);
        applyRequest(certification, request, false);

        Certifications saved = certificationsRepository.save(certification);
        return toResponse(saved);
    }

    @Transactional
    public void delete(int certificationId, String email) {
        EmployeeAccount account = resolveAccount(email);
        Certifications certification = certificationsRepository
                .findByIdAndEmployee(certificationId, account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formação não encontrada."));

        deleteFileIfExists(certification.getCertificateUrl());
        certificationsRepository.delete(certification);
    }

    private void applyRequest(Certifications certification,
                              CandidateCertificationRequest request,
                              boolean isCreate) {
        certification.setName(request.getName().trim());
        certification.setInstitution(request.getInstitution().trim());
        certification.setLocation(trimToNull(request.getLocation()));
        certification.setDescription(trimToNull(request.getDescription()));
        certification.setCompletionDate(request.getCompletionDate());

        if (StringUtils.hasText(request.getCertificateFile())) {
            String storedPath = storeCertificateFile(certification.getEmployee().getId(),
                    request.getCertificateFile(),
                    request.getCertificateFileName());
            deleteFileIfExists(certification.getCertificateUrl());
            certification.setCertificateUrl(storedPath);
        } else if (isCreate && !StringUtils.hasText(certification.getCertificateUrl())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O certificado é obrigatório.");
        }
    }

    private CandidateCertificationResponse toResponse(Certifications certification) {
        return CandidateCertificationResponse.builder()
                .id(certification.getId())
                .name(certification.getName())
                .institution(certification.getInstitution())
                .location(certification.getLocation())
                .completionDate(certification.getCompletionDate())
                .description(certification.getDescription())
                .certificateUrl(certification.getCertificateUrl())
                .build();
    }

    private EmployeeAccount resolveAccount(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilizador não autenticado.");
        }
        return employeeAccountRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta não encontrada."));
    }

    private void ensureNotDuplicate(EmployeeAccount account,
                                    CandidateCertificationRequest request,
                                    Integer currentId) {
        LocalDate completionDate = request.getCompletionDate();
        certificationsRepository
                .findByEmployeeAndNameIgnoreCaseAndInstitutionIgnoreCaseAndCompletionDate(
                        account,
                        request.getName().trim(),
                        request.getInstitution().trim(),
                        completionDate
                )
                .filter(existing -> currentId == null || existing.getId() != currentId)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Esta formação já foi registada.");
                });
    }

    private String storeCertificateFile(Integer employeeId, String payload, String originalName) {
        try {
            String base64 = extractBase64Content(payload);
            byte[] data = Base64.getDecoder().decode(base64);

            Path uploadDirectory = Paths.get(certificatesUploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadDirectory);

            String extension = resolveExtension(originalName);
            String filename = "cert_" + employeeId + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadDirectory.resolve(filename);
            Files.write(filePath, data, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Stored certificate {} for employee {}", filePath, employeeId);
            return filePath.toString();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O ficheiro do certificado é inválido.");
        } catch (IOException ex) {
            log.error("Erro a guardar certificado do funcionário {}", employeeId, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível guardar o certificado.");
        }
    }

    private void deleteFileIfExists(String storedPath) {
        if (!StringUtils.hasText(storedPath)) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(storedPath));
        } catch (IOException ex) {
            log.warn("Falha ao remover certificado {}: {}", storedPath, ex.getMessage());
        }
    }

    private String extractBase64Content(String raw) {
        int commaIndex = raw.indexOf(',');
        return commaIndex >= 0 ? raw.substring(commaIndex + 1) : raw;
    }

    private String resolveExtension(String originalName) {
        if (StringUtils.hasText(originalName) && originalName.contains(".")) {
            return originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
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
}
