package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.dto.AssignedTeamRequestResponse;
import com.teamfoundry.backend.admin.dto.TeamRequestRoleSummary;
import com.teamfoundry.backend.admin.dto.WorkRequestResponse;
import com.teamfoundry.backend.admin.service.TeamRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{id}")
    public WorkRequestResponse getAssignedRequest(@PathVariable int id) {
        return teamRequestService.getAssignedRequest(id);
    }

    @GetMapping("/{id}/roles")
    public List<TeamRequestRoleSummary> listRoleRequests(@PathVariable int id) {
        return teamRequestService.listRoleSummariesForTeam(id);
    }
}
