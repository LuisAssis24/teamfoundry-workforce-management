package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account_options.model.ActivitySectors;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivitySectorsRepository extends JpaRepository<ActivitySectors, Integer> {
    List<ActivitySectors> findByNameIn(List<String> names);
}
