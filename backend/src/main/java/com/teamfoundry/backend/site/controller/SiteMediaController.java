package com.teamfoundry.backend.site.controller;

import com.teamfoundry.backend.site.dto.SiteMediaUploadResponse;
import com.teamfoundry.backend.site.service.SiteMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/super-admin/site/media")
@RequiredArgsConstructor
public class SiteMediaController {

    private final SiteMediaService mediaService;

    @PostMapping("/upload")
    public SiteMediaUploadResponse upload(@RequestParam("file") MultipartFile file) {
        return new SiteMediaUploadResponse(mediaService.storeImage(file));
    }
}
