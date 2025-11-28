package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.model.WeeklyTip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeeklyTipRepository extends JpaRepository<WeeklyTip, Long> {

    List<WeeklyTip> findAllByOrderByDisplayOrderAsc();

    Optional<WeeklyTip> findFirstByFeaturedIsTrueAndActiveIsTrueOrderByDisplayOrderAsc();
}

