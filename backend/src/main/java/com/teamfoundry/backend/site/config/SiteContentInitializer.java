package com.teamfoundry.backend.site.config;

import com.teamfoundry.backend.site.enums.SiteSectionType;
import com.teamfoundry.backend.site.model.HomepageSection;
import com.teamfoundry.backend.site.repository.HomepageSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SiteContentInitializer implements CommandLineRunner {

    private final HomepageSectionRepository sections;

    @Override
    public void run(String... args) {
        if (sections.count() > 0) {
            return;
        }

        List<HomepageSection> defaults = List.of(
                createSection(SiteSectionType.HERO, 0,
                        "TeamFoundry",
                        "Forjamos equipas, movemos a indústria.",
                        "Quero Trabalhar", "/login",
                        "Sou Empresa", "/company-register"),
                createSection(SiteSectionType.INDUSTRIES, 1,
                        "Indústrias em que atuamos",
                        "Mostre os segmentos estratégicos onde a TeamFoundry atua.",
                        null, null,
                        null, null),
                createSection(SiteSectionType.PARTNERS, 2,
                        "Parceiros principais",
                        "Destaque empresas que confiam na TeamFoundry.",
                        null, null,
                        null, null)
        );

        sections.saveAll(defaults);
    }

    private HomepageSection createSection(SiteSectionType type,
                                          int order,
                                          String title,
                                          String subtitle,
                                          String primaryLabel,
                                          String primaryUrl,
                                          String secondaryLabel,
                                          String secondaryUrl) {
        HomepageSection section = new HomepageSection();
        section.setType(type);
        section.setDisplayOrder(order);
        section.setTitle(title);
        section.setSubtitle(subtitle);
        section.setPrimaryCtaLabel(primaryLabel);
        section.setPrimaryCtaUrl(primaryUrl);
        section.setSecondaryCtaLabel(secondaryLabel);
        section.setSecondaryCtaUrl(secondaryUrl);
        section.setActive(true);
        return section;
    }
}
