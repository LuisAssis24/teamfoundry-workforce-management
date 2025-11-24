package com.teamfoundry.backend.account.service.exception;

import org.springframework.http.HttpStatus;

public class EmployeeRegistrationException extends RuntimeException {

    private final HttpStatus status;

    public EmployeeRegistrationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
