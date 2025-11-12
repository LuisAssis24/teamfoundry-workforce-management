package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.superadmin.dto.credential.CompanyCredentialResponse;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Orquestra a leitura das credenciais empresariais pendentes,
 * mantendo qualquer regra adicional futura encapsulada aqui.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyCredentialService {

    private final CompanyAccountRepository companyAccountRepository;

    /**
     * Retorna a lista pronta para consumo pelo controller,
     * já filtrada por status=false via repositório.
     */
    public List<CompanyCredentialResponse> listPendingCompanyCredentials() {
        return companyAccountRepository.findPendingCompanyCredentials();
    }
}
