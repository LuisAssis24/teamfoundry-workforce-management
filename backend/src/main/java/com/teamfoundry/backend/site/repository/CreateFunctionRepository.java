package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.account_options.model.Function;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório dedicado à criação e pesquisa de funções (tabela funcao).
 */
public interface CreateFunctionRepository extends JpaRepository<Function, Integer> {

    /**
     * Procura uma função existente ignorando maiúsculas/minúsculas.
     */
    Optional<Function> findByNameIgnoreCase(String name);
}
