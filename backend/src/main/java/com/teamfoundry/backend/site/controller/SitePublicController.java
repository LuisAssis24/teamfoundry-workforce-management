package com.teamfoundry.backend.site.controller;

import com.teamfoundry.backend.site.dto.HomeLoginConfigResponse;
import com.teamfoundry.backend.site.dto.HomepageConfigResponse;
import com.teamfoundry.backend.site.service.SiteContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/site")
@RequiredArgsConstructor
public class SitePublicController {

    private final SiteContentService service;

    @GetMapping("/homepage")
    public HomepageConfigResponse homepage() {
        return service.getPublicHomepage();
    }

    @GetMapping("/app-home")
    public HomeLoginConfigResponse appHome() {
        return service.getPublicHomeLogin();
    }
}
