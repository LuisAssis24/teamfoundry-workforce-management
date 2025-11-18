package com.teamfoundry.backend.site.service;

import com.teamfoundry.backend.site.config.SiteMediaProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteMediaService {

    private static final long MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

    private final SiteMediaProperties properties;

    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhum ficheiro enviado.");
        }
        if (file.getSize() > MAX_FILE_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Imagem excede o limite de 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas imagens são permitidas.");
        }

        String filename = buildFilename(file.getOriginalFilename(), contentType);
        Path target = properties.getStorageDir().resolve(filename);

        try {
            Files.createDirectories(properties.getStorageDir());
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            log.error("Falha ao guardar imagem da homepage", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível guardar o ficheiro.");
        }

        return properties.getPublicPath() + "/" + filename;
    }

    private String buildFilename(String originalName, String contentType) {
        String extension = null;
        if (StringUtils.hasText(originalName)) {
            extension = StringUtils.getFilenameExtension(originalName);
        }
        if (!StringUtils.hasText(extension) && StringUtils.hasText(contentType)) {
            extension = contentType.substring(contentType.lastIndexOf('/') + 1);
        }
        String normalizedExtension = (StringUtils.hasText(extension) ? extension.trim().toLowerCase(Locale.ROOT) : "png")
                .replaceAll("[^a-z0-9]", "");
        return UUID.randomUUID() + "." + normalizedExtension;
    }
}
