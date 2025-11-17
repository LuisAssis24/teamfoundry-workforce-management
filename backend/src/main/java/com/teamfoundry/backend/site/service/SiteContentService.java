package com.teamfoundry.backend.site.service;

import com.teamfoundry.backend.site.dto.*;
import com.teamfoundry.backend.site.model.HomepageSection;
import com.teamfoundry.backend.site.model.IndustryShowcase;
import com.teamfoundry.backend.site.model.PartnerShowcase;
import com.teamfoundry.backend.site.repository.HomepageSectionRepository;
import com.teamfoundry.backend.site.repository.IndustryShowcaseRepository;
import com.teamfoundry.backend.site.repository.PartnerShowcaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SiteContentService {

    private final HomepageSectionRepository sections;
    private final IndustryShowcaseRepository industries;
    private final PartnerShowcaseRepository partners;

    /*
     * PUBLIC QUERIES
     */
    @Transactional(readOnly = true)
    public HomepageConfigResponse getPublicHomepage() {
        return new HomepageConfigResponse(
                sections.findAllByOrderByDisplayOrderAsc().stream()
                        .filter(HomepageSection::isActive)
                        .map(this::mapSection)
                        .toList(),
                industries.findAllByOrderByDisplayOrderAsc().stream()
                        .filter(IndustryShowcase::isActive)
                        .map(this::mapIndustry)
                        .toList(),
                partners.findAllByOrderByDisplayOrderAsc().stream()
                        .filter(PartnerShowcase::isActive)
                        .map(this::mapPartner)
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public HomepageConfigResponse getAdminHomepage() {
        return new HomepageConfigResponse(
                sections.findAllByOrderByDisplayOrderAsc().stream()
                        .map(this::mapSection)
                        .toList(),
                industries.findAllByOrderByDisplayOrderAsc().stream()
                        .map(this::mapIndustry)
                        .toList(),
                partners.findAllByOrderByDisplayOrderAsc().stream()
                        .map(this::mapPartner)
                        .toList()
        );
    }

    /*
     * SECTIONS
     */
    public HomepageSectionResponse updateSection(Long id, HomepageSectionUpdateRequest request) {
        HomepageSection section = sections.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Section not found"));

        section.setTitle(request.title());
        section.setSubtitle(request.subtitle());
        section.setPrimaryCtaLabel(request.primaryCtaLabel());
        section.setPrimaryCtaUrl(request.primaryCtaUrl());
        section.setSecondaryCtaLabel(request.secondaryCtaLabel());
        section.setSecondaryCtaUrl(request.secondaryCtaUrl());
        section.setActive(Boolean.TRUE.equals(request.active()));

        sections.save(section);
        return mapSection(section);
    }

    public List<HomepageSectionResponse> reorderSections(List<Long> ids) {
        List<HomepageSection> current = sections.findAllByOrderByDisplayOrderAsc();
        ensureSameElements(ids, current, HomepageSection::getId, "sections");

        applyNewOrder(ids, current, HomepageSection::getId, (item, order) -> item.setDisplayOrder(order));
        sections.saveAll(current);

        return current.stream()
                .sorted(Comparator.comparingInt(HomepageSection::getDisplayOrder))
                .map(this::mapSection)
                .toList();
    }

    /*
     * INDUSTRIES
     */
    @Transactional(readOnly = true)
    public List<IndustryShowcaseResponse> listIndustries() {
        return industries.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapIndustry)
                .toList();
    }

    public IndustryShowcaseResponse createIndustry(IndustryShowcaseRequest request) {
        IndustryShowcase entity = new IndustryShowcase();
        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setImageUrl(request.imageUrl());
        entity.setLinkUrl(request.linkUrl());
        entity.setActive(Boolean.TRUE.equals(request.active()));
        entity.setDisplayOrder(nextIndustryOrder());

        industries.save(entity);
        return mapIndustry(entity);
    }

    public IndustryShowcaseResponse updateIndustry(Long id, IndustryShowcaseRequest request) {
        IndustryShowcase entity = industries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Industry not found"));

        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setImageUrl(request.imageUrl());
        entity.setLinkUrl(request.linkUrl());
        entity.setActive(Boolean.TRUE.equals(request.active()));

        return mapIndustry(industries.save(entity));
    }

    public IndustryShowcaseResponse toggleIndustry(Long id, boolean active) {
        IndustryShowcase entity = industries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Industry not found"));
        entity.setActive(active);
        return mapIndustry(industries.save(entity));
    }

    public List<IndustryShowcaseResponse> reorderIndustries(List<Long> ids) {
        List<IndustryShowcase> current = industries.findAllByOrderByDisplayOrderAsc();
        ensureSameElements(ids, current, IndustryShowcase::getId, "industries");

        applyNewOrder(ids, current, IndustryShowcase::getId, (item, order) -> item.setDisplayOrder(order));
        industries.saveAll(current);

        return current.stream()
                .sorted(Comparator.comparingInt(IndustryShowcase::getDisplayOrder))
                .map(this::mapIndustry)
                .toList();
    }

    public void deleteIndustry(Long id) {
        IndustryShowcase entity = industries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Industry not found"));
        industries.delete(entity);
    }

    /*
     * PARTNERS
     */
    @Transactional(readOnly = true)
    public List<PartnerShowcaseResponse> listPartners() {
        return partners.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapPartner)
                .toList();
    }

    public PartnerShowcaseResponse createPartner(PartnerShowcaseRequest request) {
        PartnerShowcase entity = new PartnerShowcase();
        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setImageUrl(request.imageUrl());
        entity.setWebsiteUrl(request.websiteUrl());
        entity.setActive(Boolean.TRUE.equals(request.active()));
        entity.setDisplayOrder(nextPartnerOrder());

        partners.save(entity);
        return mapPartner(entity);
    }

    public PartnerShowcaseResponse updatePartner(Long id, PartnerShowcaseRequest request) {
        PartnerShowcase entity = partners.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partner not found"));

        entity.setName(request.name());
        entity.setDescription(request.description());
        entity.setImageUrl(request.imageUrl());
        entity.setWebsiteUrl(request.websiteUrl());
        entity.setActive(Boolean.TRUE.equals(request.active()));

        return mapPartner(partners.save(entity));
    }

    public PartnerShowcaseResponse togglePartner(Long id, boolean active) {
        PartnerShowcase entity = partners.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partner not found"));
        entity.setActive(active);
        return mapPartner(partners.save(entity));
    }

    public List<PartnerShowcaseResponse> reorderPartners(List<Long> ids) {
        List<PartnerShowcase> current = partners.findAllByOrderByDisplayOrderAsc();
        ensureSameElements(ids, current, PartnerShowcase::getId, "partners");

        applyNewOrder(ids, current, PartnerShowcase::getId, (item, order) -> item.setDisplayOrder(order));
        partners.saveAll(current);

        return current.stream()
                .sorted(Comparator.comparingInt(PartnerShowcase::getDisplayOrder))
                .map(this::mapPartner)
                .toList();
    }

    public void deletePartner(Long id) {
        PartnerShowcase entity = partners.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partner not found"));
        partners.delete(entity);
    }

    /*
     * HELPERS
     */
    private HomepageSectionResponse mapSection(HomepageSection section) {
        return new HomepageSectionResponse(
                section.getId(),
                section.getType(),
                section.isActive(),
                section.getDisplayOrder(),
                section.getTitle(),
                section.getSubtitle(),
                section.getPrimaryCtaLabel(),
                section.getPrimaryCtaUrl(),
                section.getSecondaryCtaLabel(),
                section.getSecondaryCtaUrl()
        );
    }

    private IndustryShowcaseResponse mapIndustry(IndustryShowcase entity) {
        return new IndustryShowcaseResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getImageUrl(),
                entity.getLinkUrl(),
                entity.isActive(),
                entity.getDisplayOrder()
        );
    }

    private PartnerShowcaseResponse mapPartner(PartnerShowcase entity) {
        return new PartnerShowcaseResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getImageUrl(),
                entity.getWebsiteUrl(),
                entity.isActive(),
                entity.getDisplayOrder()
        );
    }

    private <T> void ensureSameElements(List<Long> ids,
                                    List<T> current,
                                    Function<T, Long> idExtractor,
                                    String target) {
        Set<Long> payload = new LinkedHashSet<>(ids);
        Set<Long> existing = current.stream()
                .map(item -> idExtractor.apply(item))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (!payload.equals(existing) || payload.size() != current.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid identifiers supplied for " + target);
        }
    }

    private <T> void applyNewOrder(List<Long> ids,
                                   List<T> items,
                                   Function<T, Long> idExtractor,
                                   OrderUpdater<T> orderUpdater) {
        Map<Long, T> map = items.stream()
                .collect(Collectors.toMap(idExtractor, Function.identity()));
        for (int i = 0; i < ids.size(); i++) {
            T item = map.get(ids.get(i));
            if (item == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown identifier: " + ids.get(i));
            }
            orderUpdater.apply(item, i);
        }
    }

    private int nextIndustryOrder() {
        return industries.findAll().stream()
                .mapToInt(IndustryShowcase::getDisplayOrder)
                .max()
                .orElse(-1) + 1;
    }

    private int nextPartnerOrder() {
        return partners.findAll().stream()
                .mapToInt(PartnerShowcase::getDisplayOrder)
                .max()
                .orElse(-1) + 1;
    }

    @FunctionalInterface
    private interface OrderUpdater<T> {
        void apply(T item, int order);
    }
}
