package com.teamfoundry.backend.account.config;

import com.teamfoundry.backend.account.enums.RegistrationStatus;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.CompanyAccount;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.account_options.model.ActivitySectors;
import com.teamfoundry.backend.account_options.model.CompanyActivitySectors;
import com.teamfoundry.backend.account_options.repository.ActivitySectorsRepository;
import com.teamfoundry.backend.account_options.repository.CompanyActivitySectorsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@Profile("!test")
public class CompanyAccountInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(CompanyAccountInitializer.class);

    @Bean
    @Order(3)
    CommandLineRunner seedCompanyAccount(AccountRepository accountRepository,
                                         PasswordEncoder passwordEncoder,
                                         ActivitySectorsRepository activitySectorsRepository,
                                         CompanyActivitySectorsRepository companyActivitySectorsRepository) {
        return args -> {
            // Ensure all existing accounts are marked active/completed
            try {
                var all = accountRepository.findAll();
                boolean changed = false;
                for (Account acc : all) {
                    boolean updated = false;
                    if (!acc.isActive()) { acc.setActive(true); updated = true; }
                    if (acc.getRegistrationStatus() != RegistrationStatus.COMPLETED) { acc.setRegistrationStatus(RegistrationStatus.COMPLETED); updated = true; }
                    changed = changed || updated;
                }
                if (changed) {
                    accountRepository.saveAll(all);
                    LOGGER.info("Updated existing accounts to active=true and registrationStatus=COMPLETED where needed.");
                }
            } catch (Exception e) {
                LOGGER.warn("Could not normalize existing accounts defaults: {}", e.getMessage());
            }

            if (accountRepository.countByRole(UserType.COMPANY) > 0) {
                LOGGER.debug("Company account already present; skipping seed.");
                return;
            }

            Map<String, ActivitySectors> sectorsByName = loadActivitySectors(activitySectorsRepository);

            CompanyAccount company = new CompanyAccount();
            company.setEmail("contact@blueorbitlabs.com");
            company.setNif(509876321);
            company.setPassword(passwordEncoder.encode("blueorbit123"));
            company.setRole(UserType.COMPANY);
            company.setName("Blue Orbit Labs");
            company.setAddress("Av. da Liberdade 100, Lisbon");
            company.setCountry("Portugal");
            company.setPhone("+351213000000");
            company.setWebsite("https://www.blueorbitlabs.com");
            company.setDescription("Growth-stage HR analytics platform providing workforce insights.");
            company.setStatus(true);
            company.setActive(true);
            company.setRegistrationStatus(RegistrationStatus.COMPLETED);

            CompanyAccount savedCompany = accountRepository.save(company);
            LOGGER.info("Seeded default company account {}.", savedCompany.getEmail());

            List<String> defaultSectors = List.of("Fundição", "Manutenção Industrial");
            List<CompanyActivitySectors> relations = new ArrayList<>();
            for (String sectorName : defaultSectors) {
                ActivitySectors sector = sectorsByName.get(sectorName);
                if (sector == null) {
                    LOGGER.warn("Activity sector {} not found; skipping relation for {}.", sectorName, savedCompany.getEmail());
                    continue;
                }
                CompanyActivitySectors relation = new CompanyActivitySectors();
                relation.setCompany(savedCompany);
                relation.setSector(sector);
                relations.add(relation);
            }

            if (!relations.isEmpty()) {
                companyActivitySectorsRepository.saveAll(relations);
                LOGGER.info("Seeded {} company-activity sector relations for {}.", relations.size(), savedCompany.getEmail());
            } else {
                LOGGER.debug("No company-activity sector relations were created for {}.", savedCompany.getEmail());
            }
        };
    }

    private Map<String, ActivitySectors> loadActivitySectors(ActivitySectorsRepository repository) {
        Map<String, ActivitySectors> sectors = new HashMap<>();
        repository.findAll().forEach(sector -> sectors.put(sector.getName(), sector));
        return sectors;
    }
}
