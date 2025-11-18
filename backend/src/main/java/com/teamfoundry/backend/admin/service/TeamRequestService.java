package com.teamfoundry.backend.admin.service;


import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class TeamRequestService {

    private final TeamRequestRepository repository;

    public TeamRequestService(TeamRequestRepository repository) {
        this.repository = repository;
    }

    public List<TeamRequest> getAllRequests() {
        return repository.findAll();
    }

    public TeamRequest updateResponsibleAdmin(Integer requestId, Integer adminId) {
        TeamRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request não encontrada"));

        request.setResponsibleAdminId(adminId);

        return repository.save(request);
    }

}
