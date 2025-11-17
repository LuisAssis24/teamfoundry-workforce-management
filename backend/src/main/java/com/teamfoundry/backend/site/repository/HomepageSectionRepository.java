package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.enums.SiteSectionType;
import com.teamfoundry.backend.site.model.HomepageSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HomepageSectionRepository extends JpaRepository<HomepageSection, Long> {

    List<HomepageSection> findAllByOrderByDisplayOrderAsc();

    Optional<HomepageSection> findByType(SiteSectionType type);
}
