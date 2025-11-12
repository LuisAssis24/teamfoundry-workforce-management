package com.teamfoundry.backend.account.service.exception;

import org.springframework.http.HttpStatus;

public class CompanyRegistrationException extends RuntimeException {

    private final HttpStatus status;

    public CompanyRegistrationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
