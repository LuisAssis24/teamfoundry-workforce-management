package com.teamfoundry.backend.admin.config;

import com.teamfoundry.backend.admin.model.EmployeeRequest;
import com.teamfoundry.backend.admin.repository.EmployeeRequestRepository;
import com.teamfoundry.backend.admin.repository.TeamRequestRepository;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
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
import java.util.Optional;

@Configuration
@Profile("!test")
public class EmployeeRequestSeeder {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeRequestSeeder.class);

    @Bean
    @Order(6)
    CommandLineRunner seedEmployeeRequests(EmployeeRequestRepository employeeRequestRepository,
                                           TeamRequestRepository teamRequestRepository,
                                           EmployeeAccountRepository employeeAccountRepository) {
        return args -> {
            if (employeeRequestRepository.count() > 0) {
                LOGGER.debug("Employee requests already exist; skipping seeding.");
                return;
            }

            List<EmployeeRequestSeed> seeds = defaultSeeds();
            List<EmployeeRequest> toPersist = new ArrayList<>();

            for (EmployeeRequestSeed seed : seeds) {
                var team = teamRequestRepository.findById(seed.teamRequestId()).orElse(null);
                if (team == null) {
                    LOGGER.warn("TeamRequest {} not found; skipping employee request seed.", seed.teamRequestId());
                    continue;
                }

                EmployeeRequest request = new EmployeeRequest();
                request.setTeamRequest(team);
                request.setRequestedRole(seed.requestedRole());
                request.setAcceptedDate(seed.acceptedDate());

                if (seed.employeeEmail() != null) {
                    Optional<EmployeeAccount> employee = employeeAccountRepository.findByEmail(seed.employeeEmail());
                    if (employee.isPresent()) {
                        request.setEmployee(employee.get());
                    } else {
                        LOGGER.warn("Employee {} not found; leaving request {} without employee.", seed.employeeEmail(), seed.teamRequestId());
                    }
                }

                toPersist.add(request);
            }

            if (toPersist.isEmpty()) {
                LOGGER.warn("No employee requests were seeded (missing teams/employees).");
                return;
            }

            employeeRequestRepository.saveAll(toPersist);
            LOGGER.info("Seeded {} employee request(s).", toPersist.size());
        };
    }

    private List<EmployeeRequestSeed> defaultSeeds() {
        LocalDateTime now = LocalDateTime.now();
        return List.of(
                new EmployeeRequestSeed(1, "Electricista Sénior", now.minusDays(12), "joao.silva@teamfoundry.com"),
                new EmployeeRequestSeed(2, "Soldador MIG/MAG", now.minusDays(8), "ana.martins@teamfoundry.com"),
                // Trabalhos concluídos
                new EmployeeRequestSeed(3, "Técnico de Manutenção", now.minusDays(2), "joao.silva@teamfoundry.com"),
                new EmployeeRequestSeed(4, "Programador PLC", now.minusDays(4), "carlos.rocha@teamfoundry.com"),
                new EmployeeRequestSeed(5, "Engenheiro de Automação", now.minusDays(1), null),
                new EmployeeRequestSeed(6, "Eletricista Industrial", now.minusDays(20), "joao.silva@teamfoundry.com"),
                new EmployeeRequestSeed(7, "Técnico de SCADA", now.minusDays(15), "joao.silva@teamfoundry.com"),
                // Ofertas pendentes (sem funcionário associado)
                new EmployeeRequestSeed(8, "Responsável de Manutenção", null, null),
                new EmployeeRequestSeed(9, "Caldeireiro Especialista", null, null),
                new EmployeeRequestSeed(10, "Técnico de Soldadura", null, null)
        );
    }

    private record EmployeeRequestSeed(
            int teamRequestId,
            String requestedRole,
            LocalDateTime acceptedDate,
            String employeeEmail
    ) {
    }
}
