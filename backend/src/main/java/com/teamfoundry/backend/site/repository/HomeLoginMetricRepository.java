package com.teamfoundry.backend.site.repository;

import com.teamfoundry.backend.site.model.HomeLoginMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeLoginMetricRepository extends JpaRepository<HomeLoginMetric, Long> {
    List<HomeLoginMetric> findAllByOrderByDisplayOrderAsc();
}
