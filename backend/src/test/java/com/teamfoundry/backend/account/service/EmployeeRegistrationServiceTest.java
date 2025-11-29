package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.GenericResponse;
import com.teamfoundry.backend.account.dto.employee.Step1Request;
import com.teamfoundry.backend.account.dto.employee.Step2Request;
import com.teamfoundry.backend.account.dto.employee.Step3Request;
import com.teamfoundry.backend.account.dto.employee.Step4Request;
import com.teamfoundry.backend.account.dto.employee.VerificationResendRequest;
import com.teamfoundry.backend.account.enums.RegistrationStatus;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account.service.exception.DuplicateEmailException;
import com.teamfoundry.backend.account.service.exception.EmployeeRegistrationException;
import com.teamfoundry.backend.account_options.model.Competence;
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
import com.teamfoundry.backend.security.repository.AuthTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeRegistrationServiceTest {

    @Mock
    private EmployeeAccountRepository employeeAccountRepository;
    @Mock
    private AccountRepository accountRepository;
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
    private EmployeeRegistrationService employeeRegistrationService;

    private Step1Request step1Request;
    private EmployeeAccount baseAccount;

    @BeforeEach
    void setUp() {
        step1Request = new Step1Request();
        step1Request.setEmail(" Candidate@Test.com ");
        step1Request.setPassword("StrongPass123");

        baseAccount = new EmployeeAccount();
        baseAccount.setId(10);
        baseAccount.setEmail("candidate@test.com");
        baseAccount.setRegistrationStatus(RegistrationStatus.PENDING);
        baseAccount.setRole(UserType.EMPLOYEE);
        baseAccount.setActive(false);

        // @Value nǜo Ǹ processado em testes unitǭrios com Mockito, for��ando um valor.
        ReflectionTestUtils.setField(employeeRegistrationService, "verificationExpirationMinutes", 30L);
    }

    @Test
    @DisplayName("Step1 cria conta nova com email normalizado e password encriptada")
    void handleStep1_createsNewAccount() {
        when(accountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.empty());
        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("StrongPass123")).thenReturn("encoded-pass");
        when(employeeAccountRepository.save(any(EmployeeAccount.class)))
                .thenAnswer(invocation -> {
                    EmployeeAccount saved = invocation.getArgument(0);
                    saved.setId(1);
                    return saved;
                });

        GenericResponse response = employeeRegistrationService.handleStep1(step1Request);

        assertThat(response.getMessage()).isEqualTo("Conta criada com sucesso. Continue para o passo 2.");
        assertThat(response.getError()).isNull();

        ArgumentCaptor<EmployeeAccount> captor = ArgumentCaptor.forClass(EmployeeAccount.class);
        verify(employeeAccountRepository).save(captor.capture());

        EmployeeAccount persisted = captor.getValue();
        assertThat(persisted.getEmail()).isEqualTo("candidate@test.com");
        assertThat(persisted.getRole()).isEqualTo(UserType.EMPLOYEE);
        assertThat(persisted.getRegistrationStatus()).isEqualTo(RegistrationStatus.PENDING);
        assertThat(persisted.isActive()).isFalse();
        assertThat(persisted.getPassword()).isEqualTo("encoded-pass");
        verify(passwordEncoder).encode("StrongPass123");
    }

    @Test
    @DisplayName("Step1 recomeça registo pendente e limpa dados anteriores")
    void handleStep1_restartsPendingRegistration() {
        EmployeeAccount existing = new EmployeeAccount();
        existing.setId(5);
        existing.setEmail("candidate@test.com");
        existing.setName("Old");
        existing.setSurname("Data");
        existing.setBirthDate(LocalDate.of(1990, 1, 1));
        existing.setGender("MALE");
        existing.setPhone("+351999000000");
        existing.setNationality("Portugal");
        existing.setNif(111111111);
        existing.setRegistrationStatus(RegistrationStatus.PENDING);
        existing.setActive(false);

        when(accountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(existing));
        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(existing));
        when(curriculumRepository.findByEmployee(existing)).thenReturn(Optional.empty());
        when(employeeAccountRepository.save(any(EmployeeAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = employeeRegistrationService.handleStep1(step1Request);

        assertThat(response.getMessage()).isEqualTo("Conta criada com sucesso. Continue para o passo 2.");
        assertThat(existing.getName()).isNull();
        assertThat(existing.getSurname()).isNull();
        assertThat(existing.getBirthDate()).isNull();
        assertThat(existing.getGender()).isNull();
        assertThat(existing.getPhone()).isNull();
        assertThat(existing.getNationality()).isNull();
        assertThat(existing.getNif()).isNull();
        assertThat(existing.getRegistrationStatus()).isEqualTo(RegistrationStatus.PENDING);
        assertThat(existing.isActive()).isFalse();

        verify(employeeFunctionRepository).deleteByEmployee(existing);
        verify(employeeCompetenceRepository).deleteByEmployee(existing);
        verify(employeeGeoAreaRepository).deleteByEmployee(existing);
        verify(employeeAccountRepository).save(existing);
    }

    @Test
    @DisplayName("Step1 falha com DuplicateEmailException quando conta já está ativa ou completa")
    void handleStep1_throwsDuplicateForActiveAccount() {
        EmployeeAccount existing = new EmployeeAccount();
        existing.setEmail("candidate@test.com");
        existing.setRegistrationStatus(RegistrationStatus.COMPLETED);
        existing.setActive(true);

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(existing));
        when(accountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> employeeRegistrationService.handleStep1(step1Request))
                .isInstanceOf(DuplicateEmailException.class);

        verify(employeeAccountRepository, never()).save(any());
    }

    @Test
    @DisplayName("Step1 falha com 409 quando email pertence a outro tipo de conta")
    void handleStep1_throwsConflictForOtherAccountType() {
        Account other = new Account();
        other.setEmail("candidate@test.com");
        other.setRole(UserType.ADMIN);

        when(accountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(other));

        assertThatThrownBy(() -> employeeRegistrationService.handleStep1(step1Request))
                .isInstanceOf(EmployeeRegistrationException.class)
                .satisfies(ex -> assertThat(((EmployeeRegistrationException) ex).getStatus()).isEqualTo(HttpStatus.CONFLICT));

        verify(employeeAccountRepository, never()).save(any());
    }

    @Test
    @DisplayName("Step1 converte erro de integridade em conflito")
    void handleStep1_translatesDataIntegrityViolation() {
        when(accountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.empty());
        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("StrongPass123")).thenReturn("encoded");
        when(employeeAccountRepository.save(any(EmployeeAccount.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate"));

        assertThatThrownBy(() -> employeeRegistrationService.handleStep1(step1Request))
                .isInstanceOf(EmployeeRegistrationException.class)
                .satisfies(ex -> assertThat(((EmployeeRegistrationException) ex).getStatus()).isEqualTo(HttpStatus.CONFLICT));
    }

    @Test
    @DisplayName("Step2 atualiza dados pessoais")
    void handleStep2_updatesPersonalData() {
        Step2Request request = new Step2Request();
        request.setEmail("Candidate@Test.com");
        request.setFirstName("Alice");
        request.setLastName("Doe");
        request.setNationality("Portugal");
        request.setBirthDate(LocalDate.of(2000, 1, 15));
        request.setPhone("+351987654321");
        request.setNif(123456789);

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));
        when(employeeAccountRepository.save(any(EmployeeAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = employeeRegistrationService.handleStep2(request);

        assertThat(response.getMessage()).isEqualTo("Dados atualizados.");
        assertThat(baseAccount.getName()).isEqualTo("Alice");
        assertThat(baseAccount.getSurname()).isEqualTo("Doe");
        assertThat(baseAccount.getNationality()).isEqualTo("Portugal");
        assertThat(baseAccount.getBirthDate()).isEqualTo(LocalDate.of(2000, 1, 15));
        assertThat(baseAccount.getPhone()).isEqualTo("+351987654321");
        assertThat(baseAccount.getNif()).isEqualTo(123456789);
    }

    @Test
    @DisplayName("Step3 guarda preferências e gera token de verificação")
    void handleStep3_storesPreferencesAndIssuesToken() {
        Step3Request request = new Step3Request();
        request.setEmail("Candidate@Test.com  ");
        request.setRole("Developer");
        request.setAreas(List.of("Lisbon"));
        request.setSkills(List.of("Java"));
        request.setTermsAccepted(true);

        Function function = new Function();
        function.setId(1);
        function.setName("Developer");

        GeoArea area = new GeoArea();
        area.setId(1);
        area.setName("Lisbon");

        Competence competence = new Competence();
        competence.setId(1);
        competence.setName("Java");

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));
        when(functionRepository.findByName("Developer")).thenReturn(Optional.of(function));
        when(geoAreaRepository.findByName("Lisbon")).thenReturn(Optional.of(area));
        when(competenceRepository.findByName("Java")).thenReturn(Optional.of(competence));
        when(authTokenRepository.save(any(AuthToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = employeeRegistrationService.handleStep3(request);

        assertThat(response.getMessage()).contains("Prefer");

        verify(employeeFunctionRepository).deleteByEmployee(baseAccount);
        verify(employeeGeoAreaRepository).deleteByEmployee(baseAccount);
        verify(employeeCompetenceRepository).deleteByEmployee(baseAccount);

        ArgumentCaptor<EmployeeFunction> functionCaptor = ArgumentCaptor.forClass(EmployeeFunction.class);
        verify(employeeFunctionRepository).save(functionCaptor.capture());
        assertThat(functionCaptor.getValue().getFunction()).isEqualTo(function);
        assertThat(functionCaptor.getValue().getEmployee()).isEqualTo(baseAccount);

        ArgumentCaptor<List> competenceCaptor = ArgumentCaptor.forClass(List.class);
        verify(employeeCompetenceRepository).saveAll(competenceCaptor.capture());
        @SuppressWarnings("unchecked")
        List<EmployeeCompetence> competences = competenceCaptor.getValue();
        assertThat(competences)
                .singleElement()
                .extracting(EmployeeCompetence::getCompetence)
                .isEqualTo(competence);

        ArgumentCaptor<List> geoCaptor = ArgumentCaptor.forClass(List.class);
        verify(employeeGeoAreaRepository).saveAll(geoCaptor.capture());
        @SuppressWarnings("unchecked")
        List<EmployeeGeoArea> geoAreas = geoCaptor.getValue();
        assertThat(geoAreas)
                .singleElement()
                .extracting(EmployeeGeoArea::getGeoArea)
                .isEqualTo(area);

        ArgumentCaptor<AuthToken> tokenCaptor = ArgumentCaptor.forClass(AuthToken.class);
        verify(authTokenRepository).deleteAllByUser(baseAccount);
        verify(authTokenRepository).save(tokenCaptor.capture());
        verify(verificationEmailService).sendVerificationCode(eq("candidate@test.com"), eq(tokenCaptor.getValue().getToken()));

        AuthToken token = tokenCaptor.getValue();
        assertThat(token.getUser()).isEqualTo(baseAccount);
        assertThat(token.getToken()).matches("\\d{6}");
        assertThat(token.getExpireAt().after(token.getCreatedAt())).isTrue();
    }

    @Test
    @DisplayName("Step3 falha sem termos aceites")
    void handleStep3_requiresTermsAccepted() {
        Step3Request request = new Step3Request();
        request.setEmail("candidate@test.com");
        request.setRole("Any");
        request.setAreas(List.of("A"));
        request.setSkills(List.of("B"));
        request.setTermsAccepted(false);

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));

        assertThatThrownBy(() -> employeeRegistrationService.handleStep3(request))
                .isInstanceOf(EmployeeRegistrationException.class)
                .satisfies(ex -> assertThat(((EmployeeRegistrationException) ex).getStatus()).isEqualTo(HttpStatus.BAD_REQUEST));

        verifyNoInteractions(functionRepository, competenceRepository, geoAreaRepository, authTokenRepository, verificationEmailService);
    }

    @Test
    @DisplayName("Step4 ativa conta com código válido")
    void handleStep4_completesVerification() {
        Step4Request request = new Step4Request();
        request.setEmail("candidate@test.com");
        request.setVerificationCode("123456");

        AuthToken token = new AuthToken();
        token.setUser(baseAccount);
        token.setToken("123456");
        token.setCreatedAt(Timestamp.from(Instant.now()));
        token.setExpireAt(Timestamp.from(Instant.now().plusSeconds(60)));

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));
        when(authTokenRepository.findByAccountAndCode(baseAccount, "123456")).thenReturn(Optional.of(token));
        when(employeeAccountRepository.save(any(EmployeeAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = employeeRegistrationService.handleStep4(request);

        assertThat(response.getMessage()).isEqualTo("Conta verificada e ativa.");
        assertThat(baseAccount.isActive()).isTrue();
        assertThat(baseAccount.getRegistrationStatus()).isEqualTo(RegistrationStatus.COMPLETED);
        verify(authTokenRepository).delete(token);
    }

    @Test
    @DisplayName("Step4 falha com código errado")
    void handleStep4_invalidCode() {
        Step4Request request = new Step4Request();
        request.setEmail("candidate@test.com");
        request.setVerificationCode("000000");

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));
        when(authTokenRepository.findByAccountAndCode(baseAccount, "000000")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeRegistrationService.handleStep4(request))
                .isInstanceOf(EmployeeRegistrationException.class)
                .satisfies(ex -> assertThat(((EmployeeRegistrationException) ex).getStatus()).isEqualTo(HttpStatus.BAD_REQUEST));

        verify(employeeAccountRepository, never()).save(any());
        verify(authTokenRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Reenvio de código gera novo token e envia email")
    void resendVerificationCode_sendsNewToken() {
        VerificationResendRequest request = new VerificationResendRequest("Candidate@Test.com");

        when(employeeAccountRepository.findByEmail("candidate@test.com")).thenReturn(Optional.of(baseAccount));
        when(authTokenRepository.save(any(AuthToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenericResponse response = employeeRegistrationService.resendVerificationCode(request);

        assertThat(response.getMessage()).isEqualTo("Novo código enviado para o email informado.");

        ArgumentCaptor<AuthToken> tokenCaptor = ArgumentCaptor.forClass(AuthToken.class);
        verify(authTokenRepository).deleteAllByUser(baseAccount);
        verify(authTokenRepository).save(tokenCaptor.capture());
        verify(verificationEmailService).sendVerificationCode(eq("candidate@test.com"), eq(tokenCaptor.getValue().getToken()));
    }
}
