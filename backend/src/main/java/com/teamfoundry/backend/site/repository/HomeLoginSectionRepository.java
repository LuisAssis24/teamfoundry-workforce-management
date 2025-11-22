package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.enums.HomeLoginSectionType;
import com.teamfoundry.backend.site.model.HomeLoginSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HomeLoginSectionRepository extends JpaRepository<HomeLoginSection, Long> {

    Optional<HomeLoginSection> findByType(HomeLoginSectionType type);

    List<HomeLoginSection> findAllByOrderByDisplayOrderAsc();
}
