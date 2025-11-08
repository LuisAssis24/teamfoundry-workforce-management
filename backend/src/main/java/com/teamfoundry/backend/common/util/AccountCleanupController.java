package com.teamfoundry.backend.common.util;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller utilitário para exclusão de contas em ambiente de desenvolvimento.
 * Protegido pelo profile "dev" para evitar uso acidental em produção.
 */
@RestController
@Profile({"dev", "docker"})
@RequestMapping("/api/dev/accounts")
@RequiredArgsConstructor
public class AccountCleanupController {

    private final AccountCleanupService accountCleanupService;

    /**
     * Remove um candidato e todas as dependências pelo email informado.
     *
     * @param email email do candidato a ser removido
     * @return 200 vazio em caso de sucesso
     */
    @DeleteMapping("/employee")
    public ResponseEntity<Void> deleteEmployee(@RequestParam @Email @NotBlank String email) {
        accountCleanupService.deleteEmployeeAccountByEmail(email);
        return ResponseEntity.ok().build();
    }
}
