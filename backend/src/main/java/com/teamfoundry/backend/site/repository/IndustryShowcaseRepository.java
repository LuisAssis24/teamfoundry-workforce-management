package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.model.IndustryShowcase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndustryShowcaseRepository extends JpaRepository<IndustryShowcase, Long> {

    List<IndustryShowcase> findAllByOrderByDisplayOrderAsc();
}
