package com.teamfoundry.backend.account.controller.employee;

import com.teamfoundry.backend.admin.dto.EmployeeJobSummary;
import com.teamfoundry.backend.admin.service.EmployeeJobHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/employee/offers", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class EmployeeOffersController {

    private final EmployeeJobHistoryService employeeJobHistoryService;

    @GetMapping
    public List<EmployeeJobSummary> listOffers(Authentication authentication) {
        return employeeJobHistoryService.listOpenOffers();
    }

    @PostMapping("/{id}/accept")
    public EmployeeJobSummary accept(@PathVariable("id") Integer requestId, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return employeeJobHistoryService.acceptOffer(requestId, email);
    }
}
