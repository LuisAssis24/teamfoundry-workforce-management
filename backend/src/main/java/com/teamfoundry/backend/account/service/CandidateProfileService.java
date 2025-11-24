package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.Employee.EmployeeProfileResponse;
import com.teamfoundry.backend.account.dto.Employee.EmployeeProfileUpdateRequest;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final EmployeeAccountRepository employeeAccountRepository;

    /**
     * Lê o perfil do colaborador autenticado.
     */
    @Transactional(readOnly = true)
    public EmployeeProfileResponse getProfile(String email) {
        EmployeeAccount account = findByEmailOrThrow(email);
        return toResponse(account);
    }

    /**
     * Atualiza campos básicos do perfil e devolve a versão persistida.
     */
    @Transactional
    public EmployeeProfileResponse updateProfile(String email, EmployeeProfileUpdateRequest request) {
        EmployeeAccount account = findByEmailOrThrow(email);

        account.setName(request.getFirstName().trim());
        account.setSurname(request.getLastName().trim());
        account.setGender(request.getGender().trim().toUpperCase());
        account.setBirthDate(request.getBirthDate());
        account.setNationality(request.getNationality().trim());
        account.setNif(request.getNif());
        account.setPhone(request.getPhone().trim());

        EmployeeAccount saved = employeeAccountRepository.save(account);
        return toResponse(saved);
    }

    private EmployeeAccount findByEmailOrThrow(String email) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase();
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilizador nao autenticado.");
        }
        return employeeAccountRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil nao encontrado."));
    }

    private EmployeeProfileResponse toResponse(EmployeeAccount account) {
        return EmployeeProfileResponse.builder()
                .firstName(account.getName())
                .lastName(account.getSurname())
                .gender(account.getGender())
                .birthDate(account.getBirthDate())
                .nationality(account.getNationality())
                .nif(account.getNif())
                .phone(account.getPhone())
                .email(account.getEmail())
                .build();
    }
}
