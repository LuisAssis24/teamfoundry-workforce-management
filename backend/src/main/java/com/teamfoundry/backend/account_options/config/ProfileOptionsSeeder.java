package com.teamfoundry.backend.account_options.config;

import com.teamfoundry.backend.account_options.model.ActivitySectors;
import com.teamfoundry.backend.account_options.model.Competence;
import com.teamfoundry.backend.account_options.model.Function;
import com.teamfoundry.backend.account_options.model.GeoArea;
import com.teamfoundry.backend.account_options.repository.ActivitySectorsRepository;
import com.teamfoundry.backend.account_options.repository.CompetenceRepository;
import com.teamfoundry.backend.account_options.repository.FunctionRepository;
import com.teamfoundry.backend.account_options.repository.GeoAreaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Configuration
@Profile("!test")
public class ProfileOptionsSeeder {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfileOptionsSeeder.class);

    @Bean
    @Order(1)
    CommandLineRunner seedProfileOptions(ActivitySectorsRepository activitySectorsRepository,
                                         FunctionRepository functionRepository,
                                         CompetenceRepository competenceRepository,
                                         GeoAreaRepository geoAreaRepository) {
        return args -> {
            seedIfEmpty("activity sectors", activitySectorsRepository, defaultActivitySectors());
            seedIfEmpty("job functions", functionRepository, defaultFunctions());
            seedIfEmpty("competences", competenceRepository, defaultCompetences());
            seedIfEmpty("geographic areas", geoAreaRepository, defaultGeoAreas());
        };
    }

    private List<ActivitySectors> defaultActivitySectors() {
        return List.of(
                activitySector("Fundição"),
                activitySector("Manutenção Industrial")
        );
    }

    private List<Function> defaultFunctions() {
        return List.of(
                jobFunction("Eletricista"),
                jobFunction("Canalizador"),
                jobFunction("Soldador"),
                jobFunction("Carpinteiro"),
                jobFunction("Pedreiro")
        );
    }

    private List<Competence> defaultCompetences() {
        return List.of(
                competence("Eletricista"),
                competence("Canalizador"),
                competence("Soldador"),
                competence("Técnico de AVAC"),
                competence("Pintor")
        );
    }

    private List<GeoArea> defaultGeoAreas() {
        return List.of(
                geoArea("Lisboa"),
                geoArea("Porto"),
                geoArea("Braga"),
                geoArea("Faro"),
                geoArea("Madeira"),
                geoArea("Açores")
        );
    }

    private <T> void seedIfEmpty(String label,
                                 JpaRepository<T, Integer> repository,
                                 List<T> entries) {
        if (repository.count() > 0) {
            LOGGER.debug("Skipping {} seeding; repository already contains data.", label);
            return;
        }
        repository.saveAll(entries);
        LOGGER.info("Seeded {} default {} entries.", entries.size(), label);
    }

    private ActivitySectors activitySector(String name) {
        ActivitySectors sector = new ActivitySectors();
        sector.setName(name);
        return sector;
    }

    private Function jobFunction(String name) {
        Function function = new Function();
        function.setName(name);
        return function;
    }

    private Competence competence(String name) {
        Competence comp = new Competence();
        comp.setName(name);
        return comp;
    }

    private GeoArea geoArea(String name) {
        GeoArea area = new GeoArea();
        area.setName(name);
        return area;
    }
}
