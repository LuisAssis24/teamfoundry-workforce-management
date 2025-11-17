package com.teamfoundry.backend.site.controller;

import com.teamfoundry.backend.site.dto.*;
import com.teamfoundry.backend.site.service.SiteContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/site")
@RequiredArgsConstructor
public class SiteAdminController {

    private final SiteContentService service;

    @GetMapping("/homepage")
    public HomepageConfigResponse homepage() {
        return service.getAdminHomepage();
    }

    @PutMapping("/homepage/sections/{id}")
    public HomepageSectionResponse updateSection(@PathVariable Long id,
                                                 @Valid @RequestBody HomepageSectionUpdateRequest request) {
        return service.updateSection(id, request);
    }

    @PutMapping("/homepage/sections/reorder")
    public List<HomepageSectionResponse> reorderSections(@Valid @RequestBody ReorderRequest request) {
        return service.reorderSections(request.ids());
    }

    @GetMapping("/industries")
    public List<IndustryShowcaseResponse> industries() {
        return service.listIndustries();
    }

    @PostMapping("/industries")
    @ResponseStatus(HttpStatus.CREATED)
    public IndustryShowcaseResponse createIndustry(@Valid @RequestBody IndustryShowcaseRequest request) {
        return service.createIndustry(request);
    }

    @PutMapping("/industries/{id}")
    public IndustryShowcaseResponse updateIndustry(@PathVariable Long id,
                                                   @Valid @RequestBody IndustryShowcaseRequest request) {
        return service.updateIndustry(id, request);
    }

    @PatchMapping("/industries/{id}/visibility")
    public IndustryShowcaseResponse toggleIndustry(@PathVariable Long id,
                                                   @Valid @RequestBody ToggleVisibilityRequest request) {
        return service.toggleIndustry(id, request.active());
    }

    @PutMapping("/industries/reorder")
    public List<IndustryShowcaseResponse> reorderIndustries(@Valid @RequestBody ReorderRequest request) {
        return service.reorderIndustries(request.ids());
    }

    @DeleteMapping("/industries/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIndustry(@PathVariable Long id) {
        service.deleteIndustry(id);
    }

    @GetMapping("/partners")
    public List<PartnerShowcaseResponse> partners() {
        return service.listPartners();
    }

    @PostMapping("/partners")
    @ResponseStatus(HttpStatus.CREATED)
    public PartnerShowcaseResponse createPartner(@Valid @RequestBody PartnerShowcaseRequest request) {
        return service.createPartner(request);
    }

    @PutMapping("/partners/{id}")
    public PartnerShowcaseResponse updatePartner(@PathVariable Long id,
                                                 @Valid @RequestBody PartnerShowcaseRequest request) {
        return service.updatePartner(id, request);
    }

    @PatchMapping("/partners/{id}/visibility")
    public PartnerShowcaseResponse togglePartner(@PathVariable Long id,
                                                 @Valid @RequestBody ToggleVisibilityRequest request) {
        return service.togglePartner(id, request.active());
    }

    @PutMapping("/partners/reorder")
    public List<PartnerShowcaseResponse> reorderPartners(@Valid @RequestBody ReorderRequest request) {
        return service.reorderPartners(request.ids());
    }

    @DeleteMapping("/partners/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePartner(@PathVariable Long id) {
        service.deletePartner(id);
    }
}
