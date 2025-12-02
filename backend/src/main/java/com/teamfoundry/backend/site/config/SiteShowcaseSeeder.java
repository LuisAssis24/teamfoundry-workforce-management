package com.teamfoundry.backend.site.config;

import com.teamfoundry.backend.site.model.IndustryShowcase;
import com.teamfoundry.backend.site.model.PartnerShowcase;
import com.teamfoundry.backend.site.repository.IndustryShowcaseRepository;
import com.teamfoundry.backend.site.repository.PartnerShowcaseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(20)
@RequiredArgsConstructor
public class SiteShowcaseSeeder implements CommandLineRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(SiteShowcaseSeeder.class);

    private final IndustryShowcaseRepository industries;
    private final PartnerShowcaseRepository partners;

    @Override
    public void run(String... args) {
        seedIndustries();
        seedPartners();
    }

    private void seedIndustries() {
        if (industries.count() > 0) {
            LOGGER.debug("Industries already populated; skipping seed data.");
            return;
        }

        List<IndustryShowcase> defaults = List.of(
                industry(0,
                        "Metalúrgica",
                        "Unimos especialistas em caldeiraria, soldadura e inspeção dimensional para modernizar fábricas metalúrgicas.",
                        "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://www.teamfoundry.com/industrias/metalurgica"),
                industry(1,
                        "Energia e Utilities",
                        "Equipa multidisciplinar com especialistas em manutenção preditiva para parques eólicos e fotovoltaicos.",
                        "https://images.unsplash.com/photo-1509391366360-2e959784a276",
                        "https://www.teamfoundry.com/industrias/energia"),
                industry(2,
                        "Canalização Industrial",
                        "Equipa multidisciplinar para instalar e manter redes de tubagem, sistemas de vapor e processos húmidos complexos.",
                        "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
                        "https://www.teamfoundry.com/industrias/canalizacao")
        );

        industries.saveAll(defaults);
        LOGGER.info("Seeded {} industry showcase record(s).", defaults.size());
    }

    private void seedPartners() {
        if (partners.count() > 0) {
            LOGGER.debug("Partners already populated; skipping seed data.");
            return;
        }

        List<PartnerShowcase> defaults = List.of(
                partner(0,
                        "MetalWave Robotics",
                        "Joint venture focada em retrofitting de linhas automotivas com robots colaborativos.",
                        "https://images.unsplash.com/photo-1518770660439-4636190af475",
                        "https://metalwaverobotics.example.com"),
                partner(1,
                        "Nordic Wind Partners",
                        "Operador europeu de parques eólicos que confia na TeamFoundry para equipas de manutenção offshore.",
                        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
                        "https://nordicwindpartners.example.com"),
                partner(2,
                        "Pulse Logistics",
                        "Scale-up ibérica de fulfillment que escalou o headcount técnico connosco em menos de 60 dias.",
                        "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
                        "https://pulselogistics.example.com"),
                partner(3,
                        "Lusitano Shipyards",
                        "Estaleiro Atlântico modernizado com equipas híbridas para soldadura e controlo de qualidade.",
                        "https://images.unsplash.com/photo-1718314786551-798f1398a7b1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "https://lusitanoshipyards.example.com")
        );

        partners.saveAll(defaults);
        LOGGER.info("Seeded {} partner showcase record(s).", defaults.size());
    }

    private IndustryShowcase industry(int order,
                                      String name,
                                      String description,
                                      String imageUrl,
                                      String linkUrl) {
        IndustryShowcase entity = new IndustryShowcase();
        entity.setDisplayOrder(order);
        entity.setName(name);
        entity.setDescription(description);
        entity.setImageUrl(imageUrl);
        entity.setLinkUrl(linkUrl);
        entity.setActive(true);
        return entity;
    }

    private PartnerShowcase partner(int order,
                                    String name,
                                    String description,
                                    String imageUrl,
                                    String websiteUrl) {
        PartnerShowcase entity = new PartnerShowcase();
        entity.setDisplayOrder(order);
        entity.setName(name);
        entity.setDescription(description);
        entity.setImageUrl(imageUrl);
        entity.setWebsiteUrl(websiteUrl);
        entity.setActive(true);
        return entity;
    }
}
