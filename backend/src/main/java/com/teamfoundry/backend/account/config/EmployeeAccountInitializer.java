package com.teamfoundry.backend.account.config;

import com.teamfoundry.backend.account.enums.RegistrationStatus;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.account.repository.AccountRepository;
import com.teamfoundry.backend.account_options.model.Competence;
import com.teamfoundry.backend.account_options.model.EmployeeCompetence;
import com.teamfoundry.backend.account_options.model.EmployeeFunction;
import com.teamfoundry.backend.account_options.model.EmployeeGeoArea;
import com.teamfoundry.backend.account_options.model.Function;
import com.teamfoundry.backend.account_options.model.GeoArea;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeCompetenceRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeFunctionRepository;
import com.teamfoundry.backend.account_options.repository.EmployeeGeoAreaRepository;
import com.teamfoundry.backend.account_options.repository.FunctionRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@Profile("!test")
public class EmployeeAccountInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeAccountInitializer.class);

    @Bean
    @Order(2)
    CommandLineRunner seedEmployeeAccounts(AccountRepository accountRepository,
                                           PasswordEncoder passwordEncoder,
                                           FunctionRepository functionRepository,
                                           CompetenceRepository competenceRepository,
                                           GeoAreaRepository geoAreaRepository,
                                           EmployeeFunctionRepository employeeFunctionRepository,
                                           EmployeeCompetenceRepository employeeCompetenceRepository,
                                           EmployeeGeoAreaRepository employeeGeoAreaRepository) {
        return args -> {
            if (accountRepository.countByRole(UserType.EMPLOYEE) > 0) {
                LOGGER.debug("Employee accounts already present; skipping seed.");
                return;
            }

            Map<String, Function> functionsByName = loadFunctions(functionRepository);
            Map<String, Competence> competencesByName = loadCompetences(competenceRepository);
            Map<String, GeoArea> geoAreasByName = loadGeoAreas(geoAreaRepository);

            List<EmployeeSeed> seeds = List.of(
                    new EmployeeSeed("joao.silva@teamfoundry.com", 201234567, "Joao", "Silva",
                            "+351912345678", "Portugal", "MALE", LocalDate.of(1990, 5, 21), "password123",
                            List.of("Eletricista"),
                            List.of("Eletricista", "Técnico de AVAC"),
                            List.of("Lisboa", "Porto")),
                    new EmployeeSeed("maria.sousa@teamfoundry.com", 209876543, "Maria", "Sousa",
                            "+351932222333", "Portugal", "FEMALE", LocalDate.of(1992, 3, 17), "password123",
                            List.of("Canalizador"),
                            List.of("Canalizador"),
                            List.of("Braga")),
                    new EmployeeSeed("carlos.oliveira@teamfoundry.com", 301234567, "Carlos", "Oliveira",
                            "+351915667788", "Portugal", "MALE", LocalDate.of(1988, 11, 2), "password123",
                            List.of("Soldador"),
                            List.of("Soldador", "Pintor"),
                            List.of("Faro")),
                    new EmployeeSeed("ana.martins@teamfoundry.com", 309876543, "Ana", "Martins",
                            "+351934556677", "Portugal", "FEMALE", LocalDate.of(1995, 7, 8), "password123",
                            List.of("Carpinteiro"),
                            List.of("Pintor"),
                            List.of("Madeira")),
                    new EmployeeSeed("ricardo.pires@teamfoundry.com", 401234567, "Ricardo", "Pires",
                            "+351918889900", "Portugal", "MALE", LocalDate.of(1993, 1, 29), "password123",
                            List.of("Pedreiro"),
                            List.of("Eletricista"),
                            List.of("Açores"))
            );

            List<EmployeeFunction> functionRelations = new ArrayList<>();
            List<EmployeeCompetence> competenceRelations = new ArrayList<>();
            List<EmployeeGeoArea> geoAreaRelations = new ArrayList<>();

            seeds.forEach(seed -> {
                EmployeeAccount employee = new EmployeeAccount();
                employee.setEmail(seed.email());
                employee.setNif(seed.nif());
                employee.setPassword(passwordEncoder.encode(seed.rawPassword()));
                employee.setRole(UserType.EMPLOYEE);
                employee.setName(seed.firstName());
                employee.setSurname(seed.lastName());
                employee.setPhone(seed.phone());
                employee.setNationality(seed.nationality());
                employee.setGender(seed.gender());
                employee.setBirthDate(seed.birthDate());
                employee.setActive(true);
                employee.setRegistrationStatus(RegistrationStatus.COMPLETED);

                EmployeeAccount savedEmployee = accountRepository.save(employee);
                LOGGER.info("Seeded employee account {}.", seed.email());

                seed.functions().forEach(functionName -> {
                    Function function = functionsByName.get(functionName);
                    if (function == null) {
                        LOGGER.warn("Function {} not found; skipping relation for {}.", functionName, seed.email());
                        return;
                    }
                    EmployeeFunction relation = new EmployeeFunction();
                    relation.setEmployee(savedEmployee);
                    relation.setFunction(function);
                    functionRelations.add(relation);
                });

                seed.competences().forEach(competenceName -> {
                    Competence competence = competencesByName.get(competenceName);
                    if (competence == null) {
                        LOGGER.warn("Competence {} not found; skipping relation for {}.", competenceName, seed.email());
                        return;
                    }
                    EmployeeCompetence relation = new EmployeeCompetence();
                    relation.setEmployee(savedEmployee);
                    relation.setCompetence(competence);
                    competenceRelations.add(relation);
                });

                seed.geoAreas().forEach(areaName -> {
                    GeoArea geoArea = geoAreasByName.get(areaName);
                    if (geoArea == null) {
                        LOGGER.warn("Geographic area {} not found; skipping relation for {}.", areaName, seed.email());
                        return;
                    }
                    EmployeeGeoArea relation = new EmployeeGeoArea();
                    relation.setEmployee(savedEmployee);
                    relation.setGeoArea(geoArea);
                    geoAreaRelations.add(relation);
                });
            });

            if (!functionRelations.isEmpty()) {
                employeeFunctionRepository.saveAll(functionRelations);
                LOGGER.info("Seeded {} employee-function relations.", functionRelations.size());
            } else {
                LOGGER.debug("No employee-function relations were created.");
            }

            if (!competenceRelations.isEmpty()) {
                employeeCompetenceRepository.saveAll(competenceRelations);
                LOGGER.info("Seeded {} employee-competence relations.", competenceRelations.size());
            } else {
                LOGGER.debug("No employee-competence relations were created.");
            }

            if (!geoAreaRelations.isEmpty()) {
                employeeGeoAreaRepository.saveAll(geoAreaRelations);
                LOGGER.info("Seeded {} employee-geographic area relations.", geoAreaRelations.size());
            } else {
                LOGGER.debug("No employee-geographic area relations were created.");
            }
        };
    }

    private record EmployeeSeed(String email,
                                int nif,
                                String firstName,
                                String lastName,
                                String phone,
                                String nationality,
                                String gender,
                                LocalDate birthDate,
                                String rawPassword,
                                List<String> functions,
                                List<String> competences,
                                List<String> geoAreas) {
    }

    private Map<String, Function> loadFunctions(FunctionRepository repository) {
        Map<String, Function> functions = new HashMap<>();
        repository.findAll().forEach(function -> functions.put(function.getName(), function));
        return functions;
    }

    private Map<String, Competence> loadCompetences(CompetenceRepository repository) {
        Map<String, Competence> competences = new HashMap<>();
        repository.findAll().forEach(competence -> competences.put(competence.getName(), competence));
        return competences;
    }

    private Map<String, GeoArea> loadGeoAreas(GeoAreaRepository repository) {
        Map<String, GeoArea> geoAreas = new HashMap<>();
        repository.findAll().forEach(area -> geoAreas.put(area.getName(), area));
        return geoAreas;
    }
}
