package com.teamfoundry.backend.site.model;

import com.teamfoundry.backend.site.enums.SiteSectionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "site_homepage_section")
public class HomepageSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private SiteSectionType type;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(name = "primary_cta_label", length = 80)
    private String primaryCtaLabel;

    @Column(name = "primary_cta_url", length = 300)
    private String primaryCtaUrl;

    @Column(name = "secondary_cta_label", length = 80)
    private String secondaryCtaLabel;

    @Column(name = "secondary_cta_url", length = 300)
    private String secondaryCtaUrl;
}
