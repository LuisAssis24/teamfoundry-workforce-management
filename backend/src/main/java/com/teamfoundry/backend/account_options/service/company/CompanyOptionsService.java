package com.teamfoundry.backend.account_options.service.company;

import com.teamfoundry.backend.account_options.dto.company.CompanyOptionsResponse;
import com.teamfoundry.backend.account_options.repository.company.ActivitySectorsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyOptionsService {

    private final ActivitySectorsRepository activitySectorsRepository;

    public CompanyOptionsResponse loadOptions() {
        List<String> sectors = activitySectorsRepository.findAll().stream()
                .map(entity -> entity.getName())
                .sorted(String.CASE_INSENSITIVE_ORDER)
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
