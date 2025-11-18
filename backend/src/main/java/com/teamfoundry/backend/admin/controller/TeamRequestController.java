package com.teamfoundry.backend.admin.controller;

import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.service.TeamRequestService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/admin/team-requests")
class TeamRequestController {

    private final TeamRequestService service;

    public TeamRequestController(TeamRequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<TeamRequest> getAll() {
        return service.getAllRequests();
    }

    @PatchMapping("/{id}/responsible-admin")
    public TeamRequest updateResponsibleAdmin(
            @PathVariable Integer id,
            @RequestParam Integer adminId) {

        return service.updateResponsibleAdmin(id, adminId);
    }

}
