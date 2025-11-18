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
                        "Equipe de Automação Industrial",
                        "Squad focada em otimizar células robotizadas para a nova linha automotiva.",
                        State.PENDING,
                        LocalDateTime.now().minusDays(6)
                ),
                new TeamRequestSeed(
                        "contact@blueorbitlabs.com",
                        "Task force de Retrofit",
                        "Equipa multidisciplinar para upgrades elétricos e mecânicos na planta do Porto.",
                        State.ACCEPTED,
                        LocalDateTime.now().minusDays(3)
                ),
                new TeamRequestSeed(
                        "contact@blueorbitlabs.com",
                        "Célula de Manutenção Preditiva",
                        "Time para implantar sensores IoT e algoritmos de alerta precoce.",
                        State.REJECTED,
                        LocalDateTime.now().minusDays(1)
                ),
                new TeamRequestSeed(
                        "operacoes@ferromec.pt",
                        "Linha de Remanufatura Pesada",
                        "Equipe dedicada a remanufatura de peças pesadas com soldagem robotizada.",
                        State.PENDING,
                        LocalDateTime.now().minusDays(4)
                ),
                new TeamRequestSeed(
                        "operacoes@ferromec.pt",
                        "Squad Retrofit Elétrico",
                        "Time para substituir painéis de controle legado por CLPs modernos.",
                        State.ACCEPTED,
                        LocalDateTime.now().minusDays(2)
                ),
                new TeamRequestSeed(
                        "talent@atlantic-robotics.eu",
                        "Equipe de Integração AMR",
                        "Grupo focado em integração de AMRs com WMS e MES.",
                        State.PENDING,
                        LocalDateTime.now().minusDays(5)
                ),
                new TeamRequestSeed(
                        "talent@atlantic-robotics.eu",
                        "Célula de Visão Computacional",
                        "Time para calibrar câmeras e treinar modelos de inspeção.",
                        State.ACCEPTED,
                        LocalDateTime.now().minusDays(2)
                ),
                new TeamRequestSeed(
                        "hr@iberiapower.com",
                        "Equipe Subestação Norte",
                        "Task force para manutenção preventiva em subestações HV.",
                        State.PENDING,
                        LocalDateTime.now().minusDays(7)
                ),
                new TeamRequestSeed(
                        "hr@iberiapower.com",
                        "Programa de SCADA Distribuído",
                        "Equipe para rollout de SCADA redundante nas usinas solares.",
                        State.REJECTED,
                        LocalDateTime.now().minusDays(3)
                )
        );
    }

    private record TeamRequestSeed(
            String companyEmail,
            String teamName,
            String description,
            State state,
            LocalDateTime createdAt
    ) {
    }
}
