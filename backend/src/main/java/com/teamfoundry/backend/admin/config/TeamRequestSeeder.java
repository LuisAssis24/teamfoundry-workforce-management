package com.teamfoundry.backend.admin.config;

import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.admin.model.TeamRequest;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.repository.CompanyAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@Profile("!test")
public class TeamRequestSeeder {

    private static final Logger LOGGER = LoggerFactory.getLogger(TeamRequestSeeder.class);

    @Bean
    @Order(5)
    CommandLineRunner seedTeamRequests(TeamRequestRepository teamRequestRepository,
                                       CompanyAccountRepository companyAccountRepository) {
        return args -> {
            if (teamRequestRepository.count() > 0) {
                LOGGER.debug("Team requests already exist; skipping seeding.");
                return;
            }

            List<TeamRequest> toPersist = new ArrayList<>();
            for (TeamRequestSeed seed : defaultSeeds()) {
                CompanyAccount company = companyAccountRepository.findByEmail(seed.companyEmail()).orElse(null);
                if (company == null) {
                    LOGGER.warn("Company {} not found; skipping team request seed for {}.",
                            seed.companyEmail(), seed.teamName());
                    continue;
                }

                TeamRequest request = new TeamRequest();
                request.setCompany(company);
                request.setTeamName(seed.teamName());
                request.setDescription(seed.description());
                request.setState(seed.state());
                request.setResponsibleAdminId(seed.responsibleAdminId());
                request.setStartDate(seed.startDate());
                request.setEndDate(seed.endDate());
                request.setCreatedAt(seed.createdAt());
                toPersist.add(request);
            }

            if (toPersist.isEmpty()) {
                LOGGER.warn("No team requests were seeded (no matching companies).");
                return;
            }

            teamRequestRepository.saveAll(toPersist);
            LOGGER.info("Seeded {} team request(s).", toPersist.size());
        };
    }

    private List<TeamRequestSeed> defaultSeeds() {
        return List.of(
                new TeamRequestSeed(
                        "contact@blueorbitlabs.com",
                        "Equipe de Automacao Industrial",
                        "Squad focada em otimizar celulas robotizadas para a nova linha automotiva.",
                        State.INCOMPLETE,
                        null,
                        LocalDateTime.now().minusDays(10),
                        LocalDateTime.now().plusDays(30),
                        LocalDateTime.now().minusDays(6)
                ),
                new TeamRequestSeed(
                        "contact@blueorbitlabs.com",
                        "Task force de Retrofit",
                        "Equipa multidisciplinar para upgrades eletricos e mecanicos na planta do Porto.",
                        State.COMPLETE,
                        2,
                        LocalDateTime.now().minusDays(25),
                        LocalDateTime.now().minusDays(4),
                        LocalDateTime.now().minusDays(3)
                ),
                new TeamRequestSeed(
                        "contact@blueorbitlabs.com",
                        "Celula de Manutencao Preditiva",
                        "Time para implantar sensores IoT e algoritmos de alerta precoce.",
                        State.INCOMPLETE,
                        3,
                        LocalDateTime.now().minusDays(14),
                        LocalDateTime.now().plusDays(10),
                        LocalDateTime.now().minusDays(1)
                ),
                new TeamRequestSeed(
                        "operacoes@ferromec.pt",
                        "Linha de Remanufatura Pesada",
                        "Equipe dedicada a remanufatura de pecas pesadas com soldagem robotizada.",
                        State.INCOMPLETE,
                        null,
                        LocalDateTime.now().minusDays(7),
                        LocalDateTime.now().plusDays(21),
                        LocalDateTime.now().minusDays(4)
                ),
                new TeamRequestSeed(
                        "operacoes@ferromec.pt",
                        "Squad Retrofit Eletrico",
                        "Time para substituir paineis de controle legado por CLPs modernos.",
                        State.COMPLETE,
                        4,
                        LocalDateTime.now().minusDays(40),
                        LocalDateTime.now().minusDays(5),
                        LocalDateTime.now().minusDays(2)
                ),
                new TeamRequestSeed(
                        "talent@atlantic-robotics.eu",
                        "Equipe de Integracao AMR",
                        "Grupo focado em integracao de AMRs com WMS e MES.",
                        State.INCOMPLETE,
                        null,
                        LocalDateTime.now().minusDays(3),
                        LocalDateTime.now().plusDays(14),
                        LocalDateTime.now().minusDays(5)
                ),
                new TeamRequestSeed(
                        "talent@atlantic-robotics.eu",
                        "Celula de Visao Computacional",
                        "Time para calibrar cameras e treinar modelos de inspecao.",
                        State.COMPLETE,
                        8,
                        LocalDateTime.now().minusDays(18),
                        LocalDateTime.now().minusDays(1),
                        LocalDateTime.now().minusDays(2)
                ),
                new TeamRequestSeed(
                        "hr@iberiapower.com",
                        "Equipe Subestacao Norte",
                        "Task force para manutencao preventiva em subestacoes HV.",
                        State.INCOMPLETE,
                        null,
                        LocalDateTime.now().minusDays(9),
                        LocalDateTime.now().plusDays(18),
                        LocalDateTime.now().minusDays(7)
                ),
                new TeamRequestSeed(
                        "hr@iberiapower.com",
                        "Programa de SCADA Distribuido",
                        "Equipe para rollout de SCADA redundante nas usinas solares.",
                        State.INCOMPLETE,
                        6,
                        LocalDateTime.now().minusDays(16),
                        LocalDateTime.now().plusDays(5),
                        LocalDateTime.now().minusDays(3)
                )
        );
    }

    private record TeamRequestSeed(
            String companyEmail,
            String teamName,
            String description,
            State state,
            Integer responsibleAdminId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            LocalDateTime createdAt
    ) {
    }
}
