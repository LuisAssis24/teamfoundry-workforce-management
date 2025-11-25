package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.dto.AssignedTeamRequestResponse;
import com.teamfoundry.backend.admin.service.TeamRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/work-requests")
@RequiredArgsConstructor
public class AdminWorkRequestController {

    private final TeamRequestService teamRequestService;

    @GetMapping
    public List<AssignedTeamRequestResponse> listAssignedRequests() {
        return teamRequestService.listAssignedRequestsForAuthenticatedAdmin();
    }
}
