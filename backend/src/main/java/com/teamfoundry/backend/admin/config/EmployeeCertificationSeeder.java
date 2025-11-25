package com.teamfoundry.backend.admin.config;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.EmployeeAccountRepository;
import com.teamfoundry.backend.account_options.model.EmployeeCertifications;
import com.teamfoundry.backend.account_options.repository.CertificationsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
@Profile("!test")
public class EmployeeCertificationSeeder {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeCertificationSeeder.class);

    @Bean
    @Order(7)
    CommandLineRunner seedEmployeeCertifications(CertificationsRepository certificationsRepository,
                                                 EmployeeAccountRepository employeeAccountRepository) {
        return args -> {
            if (certificationsRepository.count() > 0) {
                LOGGER.debug("Employee certifications already exist; skipping seeding.");
                return;
            }

            List<EmployeeCertifications> toPersist = new ArrayList<>();
            for (CertificationSeed seed : defaultSeeds()) {
                Optional<EmployeeAccount> employeeOpt = employeeAccountRepository.findByEmail(seed.email());
                if (employeeOpt.isEmpty()) {
                    LOGGER.warn("Employee {} not found; skipping certification seed {}", seed.email(), seed.name());
                    continue;
                }
                EmployeeCertifications cert = new EmployeeCertifications();
                cert.setEmployee(employeeOpt.get());
                cert.setName(seed.name());
                cert.setInstitution(seed.institution());
                cert.setLocation(seed.location());
                cert.setCompletionDate(seed.completionDate());
                cert.setDescription(seed.description());
                cert.setCertificateUrl(null);
                toPersist.add(cert);
            }

            if (toPersist.isEmpty()) {
                LOGGER.warn("No employee certifications were seeded.");
                return;
            }

            certificationsRepository.saveAll(toPersist);
            LOGGER.info("Seeded {} certification record(s).", toPersist.size());
        };
    }

    private List<CertificationSeed> defaultSeeds() {
        return List.of(
                new CertificationSeed(
                        "joao.silva@teamfoundry.com",
                        "Certificação PLC Siemens",
                        "Siemens Academy",
                        "Lisboa",
                        LocalDate.of(2021, 5, 20),
                        "Certificação avançada em programação de CLP Siemens S7."
                ),
                new CertificationSeed(
                        "ana.martins@teamfoundry.com",
                        "Soldadura MIG/MAG Nível III",
                        "Instituto de Soldadura",
                        "Porto",
                        LocalDate.of(2020, 9, 12),
                        "Qualificação para soldadura estrutural em MIG/MAG."
                ),
                new CertificationSeed(
                        "carlos.rocha@teamfoundry.com",
                        "Automação Industrial ABB",
                        "ABB Training Center",
                        "Madrid",
                        LocalDate.of(2022, 3, 5),
                        "Formação em comissionamento de robôs ABB e integração."
                )
        );
    }

    private record CertificationSeed(
            String email,
            String name,
            String institution,
            String location,
            LocalDate completionDate,
            String description
    ) {
    }
}
