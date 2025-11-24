package com.teamfoundry.backend.site.config;

import com.teamfoundry.backend.site.enums.HomeLoginSectionType;
import com.teamfoundry.backend.site.model.HomeLoginMetric;
import com.teamfoundry.backend.site.model.HomeLoginSection;
import com.teamfoundry.backend.site.repository.HomeLoginMetricRepository;
import com.teamfoundry.backend.site.repository.HomeLoginSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds default content for the authenticated home (HomeLogin) so all
 * environments share the same initial data without manual setup.
 */
@Component
@RequiredArgsConstructor
public class HomeLoginContentInitializer implements CommandLineRunner {

    private final HomeLoginSectionRepository sections;
    private final HomeLoginMetricRepository metrics;

    @Override
    public void run(String... args) {
        if (sections.count() == 0) {
            sections.saveAll(defaultSections());
        }
        if (metrics.count() == 0) {
            metrics.saveAll(defaultMetrics());
        }
    }

    private List<HomeLoginSection> defaultSections() {
        return List.of(
                createSection(
                        HomeLoginSectionType.HERO,
                        0,
                        "Perfil 80%",
                        "Perfil =%",
                        "Equipa atual: Montagem - Empresa Alfa\nRequisicoes disponiveis: 2 novas oportunidades",
                        "Atualizar perfil",
                        "/candidato/dados-pessoais",
                        false,
                        null,
                        null,
                        6
                ),
                createSection(
                        HomeLoginSectionType.WEEKLY_TIP,
                        1,
                        "Dica da Semana",
                        "Seguranca em primeiro lugar!",
                        "Antes de comecares o turno, confirma se todos os equipamentos estao em boas condicoes.\nPequenos cuidados evitam grandes acidentes.",
                        "Ver mais",
                        "#",
                        false,
                        null,
                        null,
                        6
                ),
                createSection(
                        HomeLoginSectionType.METRICS,
                        2,
                        "As tuas metricas",
                        "As metricas mostradas na Home do utilizador autenticado.",
                        null,
                        null,
                        null,
                        false,
                        null,
                        null,
                        6
                ),
                createSection(
                        HomeLoginSectionType.NEWS,
                        3,
                        "Noticias da NewsAPI",
                        "As manchetes sao sincronizadas automaticamente. Ajuste apenas quantos cards deseja mostrar (maximo de 6).",
                        null,
                        "Ver mais",
                        "#",
                        true,
                        null,
                        null,
                        6
                )
        );
    }

    private HomeLoginSection createSection(
            HomeLoginSectionType type,
            int order,
            String title,
            String subtitle,
            String content,
            String primaryLabel,
            String primaryUrl,
            boolean apiEnabled,
            String apiUrl,
            String apiToken,
            Integer apiMaxItems
    ) {
        HomeLoginSection section = new HomeLoginSection();
        section.setType(type);
        section.setDisplayOrder(order);
        section.setActive(true);
        section.setTitle(title);
        section.setSubtitle(subtitle);
        section.setContent(content);
        section.setPrimaryCtaLabel(primaryLabel);
        section.setPrimaryCtaUrl(primaryUrl);
        section.setApiEnabled(apiEnabled);
        section.setApiUrl(apiUrl);
        section.setApiToken(apiToken);
        section.setApiMaxItems(apiMaxItems);
        return section;
    }

    private List<HomeLoginMetric> defaultMetrics() {
        return List.of(
                createMetric(0, "Equipas concluidas", "8", "Numero total de equipas ja concluidas."),
                createMetric(1, "Requisicoes em aberto", "15", "Quantidade de requisicoes atualmente em aberto."),
                createMetric(2, "Horas trabalhadas", "320h", "Horas totais trabalhadas pela equipa."),
                createMetric(3, "Avaliacao media", "4.7", "Pontuacao media de satisfacao.")
        );
    }

    private HomeLoginMetric createMetric(int order, String label, String value, String description) {
        HomeLoginMetric metric = new HomeLoginMetric();
        metric.setDisplayOrder(order);
        metric.setLabel(label);
        metric.setValue(value);
        metric.setDescription(description);
        metric.setActive(true);
        return metric;
    }
}
