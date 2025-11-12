package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.dto.company.CompanyOptionsResponse;
import com.teamfoundry.backend.account_options.repository.ActivitySectorsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyOptionsService {

    private final ActivitySectorsRepository activitySectorsRepository;

    public CompanyOptionsResponse loadOptions() {
        List<String> sectors = activitySectorsRepository.findAll().stream()
                .map(entity -> entity.getName())
                .sorted(String::compareToIgnoreCase)
                .toList();

        List<String> countries = defaultCountries();
        return new CompanyOptionsResponse(sectors, countries);
    }

    private List<String> defaultCountries() {
        return List.of(
                "Portugal",
                "Espanha",
                "França",
                "Alemanha",
                "Reino Unido",
                "Itália",
                "Polónia"
        );
    }
}
