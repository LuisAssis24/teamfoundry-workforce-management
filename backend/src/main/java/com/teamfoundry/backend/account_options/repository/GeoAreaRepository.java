package com.teamfoundry.backend.account_options.repository;

import com.teamfoundry.backend.account_options.model.GeoArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GeoAreaRepository extends JpaRepository<GeoArea, Integer> {
    Optional<GeoArea> findByName(String name);

    Optional<GeoArea> findByNameIgnoreCase(String name);
}
