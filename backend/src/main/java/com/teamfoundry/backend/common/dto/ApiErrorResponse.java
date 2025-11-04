package com.teamfoundry.backend.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;

/**
 * Payload padrao para respostas de erro em JSON.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private final String timestamp;
    private final int status;
    private final String error;
    private final Map<String, String> details;

    private ApiErrorResponse(HttpStatus status, String error, Map<String, String> details) {
        this.timestamp = Instant.now().toString();
        this.status = status.value();
        this.error = error;
        this.details = (details == null || details.isEmpty()) ? null : details;
    }

    public static ApiErrorResponse of(HttpStatus status, String error) {
        return new ApiErrorResponse(status, error, null);
    }

    public static ApiErrorResponse of(HttpStatus status, String error, Map<String, String> details) {
        return new ApiErrorResponse(status, error, details);
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}
