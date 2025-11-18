package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.model.PartnerShowcase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerShowcaseRepository extends JpaRepository<PartnerShowcase, Long> {

    List<PartnerShowcase> findAllByOrderByDisplayOrderAsc();
}
