package com.teamfoundry.backend.account_options.repository.company;

import com.teamfoundry.backend.account_options.model.company.ActivitySectors;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivitySectorsRepository extends JpaRepository<ActivitySectors, Integer> {
    List<ActivitySectors> findByNameIn(List<String> names);

    Optional<ActivitySectors> findByNameIgnoreCase(String name);
}
