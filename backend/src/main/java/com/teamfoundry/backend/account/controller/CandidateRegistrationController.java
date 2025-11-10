package com.teamfoundry.backend.account.controller;

import com.teamfoundry.backend.account.dto.GenericResponse;
import com.teamfoundry.backend.account.dto.Step1Request;
import com.teamfoundry.backend.account.dto.Step2Request;
import com.teamfoundry.backend.account.dto.Step3Request;
import com.teamfoundry.backend.account.dto.Step4Request;
import com.teamfoundry.backend.account.service.CandidateRegistrationService;
import com.teamfoundry.backend.account.service.exception.CandidateRegistrationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/candidate/register", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Slf4j
public class CandidateRegistrationController {

    private final CandidateRegistrationService registrationService;

    @PostMapping("/step1")
    public ResponseEntity<GenericResponse> registerStep1(@Valid @RequestBody Step1Request request) {
        GenericResponse response = registrationService.handleStep1(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/step2")
    public ResponseEntity<GenericResponse> registerStep2(@Valid @RequestBody Step2Request request) {
        GenericResponse response = registrationService.handleStep2(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/step3")
    public ResponseEntity<GenericResponse> registerStep3(@Valid @RequestBody Step3Request request) {
        GenericResponse response = registrationService.handleStep3(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/step4")
    public ResponseEntity<GenericResponse> registerStep4(@Valid @RequestBody Step4Request request) {
        GenericResponse response = registrationService.handleStep4(request);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(CandidateRegistrationException.class)
    public ResponseEntity<GenericResponse> handleRegistrationException(CandidateRegistrationException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(GenericResponse.failure(exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GenericResponse> handleValidationErrors(MethodArgumentNotValidException exception) {
        String errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("Erro de validação no registo: {}", errors);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(GenericResponse.failure(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericResponse> handleUnexpectedExceptions(Exception exception) {
        log.error("Erro inesperado no fluxo de registo", exception);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(GenericResponse.failure("Ocorreu um erro inesperado. Tente novamente."));
    }
}
