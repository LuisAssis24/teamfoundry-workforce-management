package com.teamfoundry.backend.superadmin.controller.work;

import com.teamfoundry.backend.admin.dto.WorkRequestAdminOption;
import com.teamfoundry.backend.admin.dto.WorkRequestResponse;
import com.teamfoundry.backend.admin.service.TeamRequestService;
import com.teamfoundry.backend.superadmin.dto.work.AssignAdminRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/work-requests")
@RequiredArgsConstructor
public class SuperAdminWorkRequestController {

    private final TeamRequestService teamRequestService;

    @GetMapping
    public List<WorkRequestResponse> listAll() {
        return teamRequestService.listAllWorkRequests();
    }

    @GetMapping("/admin-options")
    public List<WorkRequestAdminOption> listAdminOptions() {
        return teamRequestService.listAssignableAdmins();
    }

    @PatchMapping("/{id}/responsible-admin")
    public WorkRequestResponse assignResponsibleAdmin(@PathVariable int id,
                                                      @Valid @RequestBody AssignAdminRequest request) {
        return teamRequestService.assignResponsibleAdmin(id, request.adminId());
    }
}
