package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.service.AdminInvitationService;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Convites de colaboradores para vagas em equipas (admin).
 */
@RestController
@RequestMapping(value = "/api/admin/work-requests", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminInvitationController {

    private final AdminInvitationService adminInvitationService;

    public AdminInvitationController(AdminInvitationService adminInvitationService) {
        this.adminInvitationService = adminInvitationService;
    }

    @PostMapping("/{teamId}/roles/{role}/invites")
    public Map<String, Object> sendInvites(@PathVariable Integer teamId,
                                           @PathVariable String role,
                                           @RequestBody InviteRequest body) {
        int created = adminInvitationService.sendInvites(teamId, role, body.candidateIds());
        return Map.of("invitesCreated", created);
    }

    @GetMapping("/{teamId}/roles/{role}/invites")
    public List<Integer> listInvited(@PathVariable Integer teamId, @PathVariable String role) {
        return adminInvitationService.listActiveInviteIds(teamId, role);
    }

    @GetMapping("/{teamId}/accepted")
    public List<Integer> listAccepted(@PathVariable Integer teamId) {
        return adminInvitationService.listAcceptedIds(teamId);
    }

    public record InviteRequest(@NotNull @NotEmpty List<Integer> candidateIds) {}
}
