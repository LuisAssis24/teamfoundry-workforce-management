package com.teamfoundry.backend.account.repository;

import com.teamfoundry.backend.account.dto.CompanyCredentialResponse;
import com.teamfoundry.backend.account.model.CompanyAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repositório dedicado à entidade CompanyAccount.
 * Mantém consultas específicas para o fluxo de aprovação de credenciais.
 */
public interface CompanyAccountRepository extends JpaRepository<CompanyAccount, Integer> {

    /**
     * Busca somente contas de empresa com status pendente (status=false),
     * incluindo o responsável associado. A projeção direta no DTO evita
     * carregamentos adicionais na camada de serviço.
     */
    @Query("""
            SELECT new com.teamfoundry.backend.account.dto.CompanyCredentialResponse(
                c.id,
                c.name,
                c.email,
                c.website,
                c.address,
                c.nif,
                c.country,
                owner.name,
                owner.email,
                owner.phone,
                owner.position
            )
            FROM CompanyAccount c
            LEFT JOIN CompanyAccountOwner owner ON owner.companyAccount = c
            WHERE c.status = false
            ORDER BY c.id DESC
            """)
    List<CompanyCredentialResponse> findPendingCompanyCredentials();
}
