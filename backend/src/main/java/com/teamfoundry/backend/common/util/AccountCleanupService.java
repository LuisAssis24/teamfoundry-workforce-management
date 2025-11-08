package com.teamfoundry.backend.common.util;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account.repository.AuthTokenRepository;
import com.teamfoundry.backend.account_options.repository.CurriculumRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeGeoAreaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Utilitário que remove um candidato e todas as relações dependentes (funções, competências, etc.).
 * Útil em ambientes de desenvolvimento para “limpar” contas sem ter de recriar a base.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountCleanupService {

    private final EmployeeAccountRepository employeeAccountRepository;
    private final EmployeeFunctionRepository employeeFunctionRepository;
    private final EmployeeCompetenceRepository employeeCompetenceRepository;
    private final EmployeeGeoAreaRepository employeeGeoAreaRepository;
    private final CurriculumRepository curriculumRepository;
    private final AuthTokenRepository authTokenRepository;

    /**
     * Remove um EmployeeAccount e todas as dependências pelo email informado.
     *
     * @param email email do candidato a remover
     * @throws EntityNotFoundException se a conta não existir
     */
    @Transactional
    public void deleteEmployeeAccountByEmail(String email) {
        EmployeeAccount account = employeeAccountRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada para o email informado."));

        log.info("Eliminando dados dependentes do candidato {}", email);
        employeeFunctionRepository.deleteByEmployee(account);
        employeeCompetenceRepository.deleteByEmployee(account);
        employeeGeoAreaRepository.deleteByEmployee(account);
        curriculumRepository.deleteByEmployee(account);
        authTokenRepository.deleteAllByUser(account);

        employeeAccountRepository.delete(account);
        log.info("Conta {} removida com sucesso.", email);
    }
}
