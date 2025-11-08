package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.GenericResponse;
import com.teamfoundry.backend.account.dto.Step1Request;
import com.teamfoundry.backend.account.dto.Step2Request;
import com.teamfoundry.backend.account.dto.Step3Request;
import com.teamfoundry.backend.account.dto.Step4Request;
import com.teamfoundry.backend.account.dto.VerificationResendRequest;
import com.teamfoundry.backend.account.enums.RegistrationStatus;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AuthTokenRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account.service.exception.CandidateRegistrationException;
import com.teamfoundry.backend.account.service.exception.DuplicateEmailException;
import com.teamfoundry.backend.account_options.model.Competence;
import com.teamfoundry.backend.account_options.model.Curriculum;
import com.teamfoundry.backend.account_options.model.EmployeeCompetence;
import com.teamfoundry.backend.account_options.model.EmployeeFunction;
import com.teamfoundry.backend.account_options.model.EmployeeGeoArea;
import com.teamfoundry.backend.account_options.model.Function;
import com.teamfoundry.backend.account_options.model.GeoArea;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.CurriculumRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeGeoAreaRepository;
import com.teamfoundry.backend.account_options.repository.FunctionRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import com.teamfoundry.backend.security.model.AuthToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateRegistrationService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final FunctionRepository functionRepository;
    private final EmployeeFunctionRepository employeeFunctionRepository;
    private final CompetenceRepository competenceRepository;
    private final EmployeeCompetenceRepository employeeCompetenceRepository;
    private final GeoAreaRepository geoAreaRepository;
    private final EmployeeGeoAreaRepository employeeGeoAreaRepository;
    private final CurriculumRepository curriculumRepository;
    private final VerificationEmailService verificationEmailService;

    @Value("${app.registration.cv-upload-dir:uploads/cv}")
    private String cvUploadDir;

    @Value("${app.registration.verification.expiration-minutes:30}")
    private long verificationExpirationMinutes;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public GenericResponse handleStep1(Step1Request request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<EmployeeAccount> existingAccountOpt = employeeAccountRepository.findByEmail(normalizedEmail);

        EmployeeAccount account = existingAccountOpt.orElseGet(EmployeeAccount::new);

        if (existingAccountOpt.isPresent()) {
            if (Boolean.TRUE.equals(account.isActive()) || RegistrationStatus.COMPLETED.equals(account.getRegistrationStatus())) {
                throw new DuplicateEmailException("O email informado já está associado a uma conta ativa.");
            }
            resetAccountForRestart(account);
        } else {
            account.setEmail(normalizedEmail);
            account.setRole(UserType.EMPLOYEE);
        }

        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRegistrationStatus(RegistrationStatus.PENDING);
        account.setActive(false);

        EmployeeAccount savedAccount = employeeAccountRepository.save(account);
        issueVerificationCode(savedAccount);

        return GenericResponse.success("Conta criada com sucesso. Código enviado para o email.");
    }

    @Transactional
    public GenericResponse handleStep2(Step2Request request) {
        EmployeeAccount account = findAccountByEmail(request.getEmail());

        account.setName(request.getFirstName());
        account.setSurname(request.getLastName());
        account.setPhone(request.getPhone());
        account.setNationality(request.getNationality());
        account.setBirthDate(request.getBirthDate());
        account.setNif(request.getNif());

        String storedPath = storeCvIfPresent(account, request.getCvFile(), request.getCvFileName());
        employeeAccountRepository.save(account);

        if (storedPath != null) {
            Curriculum curriculum = curriculumRepository.findByEmployee(account)
                    .orElseGet(() -> {
                        Curriculum cv = new Curriculum();
                        cv.setEmployee(account);
                        return cv;
                    });

            deleteFileIfExists(curriculum.getCvUrl());
            curriculum.setCvUrl(storedPath);
            curriculumRepository.save(curriculum);
        }

        return GenericResponse.success("Dados atualizados.");
    }

    @Transactional
    public GenericResponse handleStep3(Step3Request request) {
        EmployeeAccount account = findAccountByEmail(request.getEmail());

        if (Boolean.FALSE.equals(request.getTermsAccepted())) {
            throw new CandidateRegistrationException("É necessário aceitar os termos e condições.", HttpStatus.BAD_REQUEST);
        }

        applyFunctionPreference(account, request.getRole());
        applyCompetencePreferences(account, request.getSkills());
        applyGeoAreaPreferences(account, request.getAreas());

        issueVerificationCode(account);
        return GenericResponse.success("Preferências guardadas. Código enviado para o seu email.");
    }

    @Transactional
    public GenericResponse handleStep4(Step4Request request) {
        EmployeeAccount account = findAccountByEmail(request.getEmail());

        AuthToken token = authTokenRepository.findByAccountAndCode(account, request.getVerificationCode())
                .orElseThrow(() -> new CandidateRegistrationException("Código de verificação inválido.", HttpStatus.BAD_REQUEST));

        if (token.getExpireAt().before(Timestamp.from(Instant.now()))) {
            throw new CandidateRegistrationException("O código de verificação expirou.", HttpStatus.BAD_REQUEST);
        }

        account.setActive(true);
        account.setRegistrationStatus(RegistrationStatus.COMPLETED);
        employeeAccountRepository.save(account);

        authTokenRepository.delete(token);
        return GenericResponse.success("Conta verificada e ativa.");
    }

    @Transactional
    public GenericResponse resendVerificationCode(VerificationResendRequest request) {
        EmployeeAccount account = findAccountByEmail(request.email());
        issueVerificationCode(account);
        return GenericResponse.success("Novo código enviado para o email informado.");
    }

    private EmployeeAccount findAccountByEmail(String email) {
        return employeeAccountRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new CandidateRegistrationException("Conta não encontrada para o email informado.", HttpStatus.NOT_FOUND));
    }

    private void issueVerificationCode(EmployeeAccount account) {
        authTokenRepository.deleteAllByUser(account);
        AuthToken token = buildVerificationToken(account);
        authTokenRepository.save(token);
        verificationEmailService.sendVerificationCode(account.getEmail(), token.getToken());
        log.info("Generated verification code {} for candidate {}", token.getToken(), account.getEmail());
    }

    private AuthToken buildVerificationToken(EmployeeAccount account) {
        AuthToken token = new AuthToken();
        token.setUser(account);
        token.setToken(generateNumericCode(6));
        Instant now = Instant.now();
        token.setCreatedAt(Timestamp.from(now));
        token.setExpireAt(Timestamp.from(now.plus(verificationExpirationMinutes, ChronoUnit.MINUTES)));
        return token;
    }

    private String storeCvIfPresent(EmployeeAccount account, String cvPayload, String originalName) {
        if (!StringUtils.hasText(cvPayload)) {
            return null;
        }

        try {
            String base64 = extractBase64Content(cvPayload);
            byte[] data = Base64.getDecoder().decode(base64);

            Path uploadDirectory = Paths.get(cvUploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadDirectory);

            String extension = resolveExtension(originalName);
            String filename = "cv_" + account.getId() + "_" + System.currentTimeMillis() + extension;
            Path filePath = uploadDirectory.resolve(filename);

            Files.write(filePath, data, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Stored CV for {} at {}", account.getEmail(), filePath);
            return filePath.toString();
        } catch (IllegalArgumentException ex) {
            throw new CandidateRegistrationException("O ficheiro de CV enviado é inválido.", HttpStatus.BAD_REQUEST);
        } catch (IOException ex) {
            log.error("Error storing CV file for {}", account.getEmail(), ex);
            throw new CandidateRegistrationException("Não foi possível guardar o CV. Tente novamente.", HttpStatus.INTERNAL_SERVER_ERROR);
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

    private String generateNumericCode(int length) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(secureRandom.nextInt(10));
        }
        return builder.toString();
    }

    private void resetAccountForRestart(EmployeeAccount account) {
        if (account.getId() != null) {
            removeCvIfExists(account);
            employeeFunctionRepository.deleteByEmployee(account);
            employeeCompetenceRepository.deleteByEmployee(account);
            employeeGeoAreaRepository.deleteByEmployee(account);
        }
        account.setName(null);
        account.setSurname(null);
        account.setPhone(null);
        account.setNationality(null);
        account.setGender(null);
        account.setBirthDate(null);
        account.setNif(null);
    }

    private void removeCvIfExists(EmployeeAccount account) {
        if (account.getId() == null) {
            return;
        }
        curriculumRepository.findByEmployee(account).ifPresent(cv -> {
            deleteFileIfExists(cv.getCvUrl());
            curriculumRepository.delete(cv);
        });
    }

    private void deleteFileIfExists(String storedPath) {
        if (!StringUtils.hasText(storedPath)) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(storedPath));
        } catch (IOException ex) {
            log.warn("Falha ao remover ficheiro {}: {}", storedPath, ex.getMessage());
        }
    }

    private void applyFunctionPreference(EmployeeAccount account, String functionName) {
        employeeFunctionRepository.deleteByEmployee(account);

        if (!StringUtils.hasText(functionName)) {
            throw new CandidateRegistrationException("Função preferencial é obrigatória.", HttpStatus.BAD_REQUEST);
        }

        Function function = functionRepository.findByName(functionName.trim())
                .orElseThrow(() -> new CandidateRegistrationException("Função não encontrada: " + functionName, HttpStatus.BAD_REQUEST));

        EmployeeFunction relation = new EmployeeFunction();
        relation.setEmployee(account);
        relation.setFunction(function);
        employeeFunctionRepository.save(relation);
    }

    private void applyCompetencePreferences(EmployeeAccount account, List<String> skills) {
        employeeCompetenceRepository.deleteByEmployee(account);

        if (Objects.isNull(skills) || skills.isEmpty()) {
            throw new CandidateRegistrationException("Pelo menos uma competência deve ser selecionada.", HttpStatus.BAD_REQUEST);
        }

        List<EmployeeCompetence> relations = skills.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .distinct()
                .map(name -> {
                    Competence competence = competenceRepository.findByName(name)
                            .orElseThrow(() -> new CandidateRegistrationException("Competência não encontrada: " + name, HttpStatus.BAD_REQUEST));
                    EmployeeCompetence relation = new EmployeeCompetence();
                    relation.setEmployee(account);
                    relation.setCompetence(competence);
                    return relation;
                })
                .toList();

        employeeCompetenceRepository.saveAll(relations);
    }

    private void applyGeoAreaPreferences(EmployeeAccount account, List<String> areas) {
        employeeGeoAreaRepository.deleteByEmployee(account);

        if (Objects.isNull(areas) || areas.isEmpty()) {
            throw new CandidateRegistrationException("Selecione pelo menos uma área geográfica.", HttpStatus.BAD_REQUEST);
        }

        List<EmployeeGeoArea> relations = areas.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .distinct()
                .map(name -> {
                    GeoArea area = geoAreaRepository.findByName(name)
                            .orElseThrow(() -> new CandidateRegistrationException("Área geográfica não encontrada: " + name, HttpStatus.BAD_REQUEST));
                    EmployeeGeoArea relation = new EmployeeGeoArea();
                    relation.setEmployee(account);
                    relation.setGeoArea(area);
                    return relation;
                })
                .toList();

        employeeGeoAreaRepository.saveAll(relations);
    }
}
