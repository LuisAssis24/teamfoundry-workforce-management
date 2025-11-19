package com.teamfoundry.backend.site.model;

import com.teamfoundry.backend.site.enums.HomeLoginSectionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Configurable building block for the authenticated landing page (HomeLogin).
 * Mirrors HomepageSection but includes API metadata so the News block can pull
 * articles from an external endpoint once integrated.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "site_home_login_section")
public class HomeLoginSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 40)
    private HomeLoginSectionType type;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(length = 2000)
    private String content;

    @Column(name = "primary_cta_label", length = 80)
    private String primaryCtaLabel;

    @Column(name = "primary_cta_url", length = 300)
    private String primaryCtaUrl;

    /**
     * Metadata for future integration with the news API.
     * When apiEnabled is true the backend can fetch items from apiUrl using the
     * provided credentials/settings.
     */
    @Column(name = "api_enabled")
    private boolean apiEnabled = false;

    @Column(name = "api_url", length = 500)
    private String apiUrl;

    @Column(name = "api_token", length = 500)
    private String apiToken;

    @Column(name = "api_max_items")
    private Integer apiMaxItems;
}
