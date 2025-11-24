package com.teamfoundry.backend.account.service.exception;

import org.springframework.http.HttpStatus;

public class DuplicateEmailException extends EmployeeRegistrationException {
    public DuplicateEmailException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
