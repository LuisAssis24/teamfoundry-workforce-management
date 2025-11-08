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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Testes unitários focados nos fluxos principais do {@link CandidateRegistrationService}.
 */
@ExtendWith(MockitoExtension.class)
class CandidateRegistrationServiceTest {

    @Mock
    private EmployeeAccountRepository employeeAccountRepository;
    @Mock
    private AuthTokenRepository authTokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private FunctionRepository functionRepository;
    @Mock
    private EmployeeFunctionRepository employeeFunctionRepository;
    @Mock
    private CompetenceRepository competenceRepository;
    @Mock
    private EmployeeCompetenceRepository employeeCompetenceRepository;
    @Mock
    private GeoAreaRepository geoAreaRepository;
    @Mock
    private EmployeeGeoAreaRepository employeeGeoAreaRepository;
    @Mock
    private CurriculumRepository curriculumRepository;
    @Mock
    private VerificationEmailService verificationEmailService;

    @InjectMocks
    private CandidateRegistrationService candidateRegistrationService;

    @TempDir
    Path tempDir;

    private EmployeeAccount pendingAccount;

    @BeforeEach
    void setUp() {
        pendingAccount = new EmployeeAccount();
        pendingAccount.setId(1);
        pendingAccount.setEmail("user@example.com");
        pendingAccount.setPassword("bcrypt");
        pendingAccount.setRole(UserType.EMPLOYEE);
        pendingAccount.setRegistrationStatus(RegistrationStatus.PENDING);
        ReflectionTestUtils.setField(candidateRegistrationService, "cvUploadDir", tempDir.toString());
        ReflectionTestUtils.setField(candidateRegistrationService, "verificationExpirationMinutes", 30L);
    }

    @Test
    @DisplayName("handleStep1 grava credenciais e envia código quando email é novo")
    void handleStep1CreatesAccount() {
        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("Strong@123")).thenReturn("encoded");
        when(employeeAccountRepository.save(any(EmployeeAccount.class))).thenReturn(pendingAccount);

        Step1Request request = new Step1Request();
        request.setEmail("user@example.com");
        request.setPassword("Strong@123");

        candidateRegistrationService.handleStep1(request);

        verify(employeeAccountRepository).save(any(EmployeeAccount.class));
        verify(authTokenRepository).deleteAllByUser(pendingAccount);
        verify(authTokenRepository).save(any());
        verify(verificationEmailService).sendVerificationCode(eq("user@example.com"), any());
    }

    @Test
    @DisplayName("handleStep1 lança DuplicateEmailException se email já existir e estiver ativo")
    void handleStep1ThrowsIfEmailTaken() {
        EmployeeAccount active = new EmployeeAccount();
        active.setActive(true);
        when(employeeAccountRepository.findByEmail("taken@example.com"))
                .thenReturn(Optional.of(active));

        Step1Request request = new Step1Request();
        request.setEmail("taken@example.com");
        request.setPassword("Strong@123");

        assertThatThrownBy(() -> candidateRegistrationService.handleStep1(request))
                .isInstanceOf(DuplicateEmailException.class);
    }

    @Test
    @DisplayName("handleStep4 ativa conta quando o token é válido")
    void handleStep4ActivatesAccount() {
        Step4Request request = new Step4Request();
        request.setEmail("user@example.com");
        request.setVerificationCode("123456");

        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));

        AuthToken token = new AuthToken();
        token.setToken("123456");
        token.setExpireAt(Timestamp.from(Instant.now().plusSeconds(60)));
        when(authTokenRepository.findByAccountAndCode(pendingAccount, "123456"))
                .thenReturn(Optional.of(token));

        candidateRegistrationService.handleStep4(request);

        assertThat(pendingAccount.isActive()).isTrue();
        assertThat(pendingAccount.getRegistrationStatus()).isEqualTo(RegistrationStatus.COMPLETED);
        verify(authTokenRepository).delete(token);
        verify(employeeAccountRepository).save(pendingAccount);
    }

    @Test
    @DisplayName("handleStep2 atualiza dados pessoais e guarda CV base64")
    void handleStep2UpdatesPersonalDataAndStoresCv() {
        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));
        when(curriculumRepository.findByEmployee(pendingAccount)).thenReturn(Optional.empty());

        Step2Request request = new Step2Request();
        request.setEmail("user@example.com");
        request.setFirstName("Ana");
        request.setLastName("Silva");
        request.setNationality("Portuguesa");
        request.setBirthDate(LocalDate.of(1990, 1, 1));
        request.setPhone("+351910000000");
        request.setNif(123456789);
        request.setCvFile("data:application/pdf;base64," + Base64.getEncoder().encodeToString("cv".getBytes(StandardCharsets.UTF_8)));
        request.setCvFileName("curriculo.pdf");

        GenericResponse response = candidateRegistrationService.handleStep2(request);

        assertThat(pendingAccount.getName()).isEqualTo("Ana");
        assertThat(pendingAccount.getSurname()).isEqualTo("Silva");
        assertThat(response.getMessage()).isEqualTo("Dados atualizados.");
        verify(employeeAccountRepository).save(pendingAccount);

        ArgumentCaptor<Curriculum> curriculumCaptor = ArgumentCaptor.forClass(Curriculum.class);
        verify(curriculumRepository).save(curriculumCaptor.capture());
        assertThat(curriculumCaptor.getValue().getCvUrl()).contains(tempDir.toString());
    }

    @Test
    @DisplayName("handleStep3 aplica preferências e emite novo código")
    void handleStep3AppliesPreferencesAndIssuesCode() {
        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));

        Function function = new Function();
        function.setName("Soldador");
        when(functionRepository.findByName("Soldador")).thenReturn(Optional.of(function));

        Competence competence = new Competence();
        competence.setName("Eletricista");
        when(competenceRepository.findByName("Eletricista")).thenReturn(Optional.of(competence));

        GeoArea area = new GeoArea();
        area.setName("Lisboa");
        when(geoAreaRepository.findByName("Lisboa")).thenReturn(Optional.of(area));

        when(authTokenRepository.save(any(AuthToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Step3Request request = new Step3Request();
        request.setEmail("user@example.com");
        request.setRole("Soldador");
        request.setSkills(List.of("Eletricista"));
        request.setAreas(List.of("Lisboa"));
        request.setTermsAccepted(true);

        GenericResponse response = candidateRegistrationService.handleStep3(request);

        assertThat(response.getMessage()).contains("Preferências guardadas");
        verify(employeeFunctionRepository).deleteByEmployee(pendingAccount);
        verify(employeeFunctionRepository).save(any(EmployeeFunction.class));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<EmployeeCompetence>> competenceCaptor = ArgumentCaptor.forClass(List.class);
        verify(employeeCompetenceRepository).saveAll(competenceCaptor.capture());
        assertThat(competenceCaptor.getValue()).hasSize(1);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<EmployeeGeoArea>> areaCaptor = ArgumentCaptor.forClass(List.class);
        verify(employeeGeoAreaRepository).saveAll(areaCaptor.capture());
        assertThat(areaCaptor.getValue()).hasSize(1);

        verify(authTokenRepository).deleteAllByUser(pendingAccount);
        verify(verificationEmailService).sendVerificationCode(eq("user@example.com"), any());
    }

    @Test
    @DisplayName("handleStep3 falha quando os termos não são aceites")
    void handleStep3ThrowsWhenTermsNotAccepted() {
        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));

        Step3Request request = new Step3Request();
        request.setEmail("user@example.com");
        request.setRole("Soldador");
        request.setSkills(List.of("Eletricista"));
        request.setAreas(List.of("Lisboa"));
        request.setTermsAccepted(false);

        assertThatThrownBy(() -> candidateRegistrationService.handleStep3(request))
                .isInstanceOf(CandidateRegistrationException.class)
                .hasMessageContaining("termos");

        verifyNoInteractions(functionRepository, competenceRepository, geoAreaRepository);
    }

    @Test
    @DisplayName("handleStep4 lança exceção quando o código não existe")
    void handleStep4ThrowsWhenTokenMissing() {
        Step4Request request = new Step4Request();
        request.setEmail("user@example.com");
        request.setVerificationCode("654321");

        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));
        when(authTokenRepository.findByAccountAndCode(pendingAccount, "654321"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateRegistrationService.handleStep4(request))
                .isInstanceOf(CandidateRegistrationException.class)
                .hasMessageContaining("inválido");
    }

    @Test
    @DisplayName("handleStep4 falha quando o código está expirado")
    void handleStep4ThrowsWhenTokenExpired() {
        Step4Request request = new Step4Request();
        request.setEmail("user@example.com");
        request.setVerificationCode("123456");

        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));

        AuthToken token = new AuthToken();
        token.setToken("123456");
        token.setExpireAt(Timestamp.from(Instant.now().minusSeconds(30)));
        when(authTokenRepository.findByAccountAndCode(pendingAccount, "123456"))
                .thenReturn(Optional.of(token));

        assertThatThrownBy(() -> candidateRegistrationService.handleStep4(request))
                .isInstanceOf(CandidateRegistrationException.class)
                .hasMessageContaining("expirou");
    }

    @Test
    @DisplayName("resendVerificationCode limpa tokens antigos e envia novo email")
    void resendVerificationCodeIssuesNewCode() {
        when(employeeAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(pendingAccount));
        when(authTokenRepository.save(any(AuthToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = candidateRegistrationService.resendVerificationCode(new VerificationResendRequest("user@example.com"));

        assertThat(response.getMessage()).isEqualTo("Novo código enviado para o email informado.");
        verify(authTokenRepository).deleteAllByUser(pendingAccount);
        verify(verificationEmailService).sendVerificationCode(eq("user@example.com"), any());
    }
}
