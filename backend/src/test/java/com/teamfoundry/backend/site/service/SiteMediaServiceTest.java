package com.teamfoundry.backend.site.service;

import com.teamfoundry.backend.site.config.SiteMediaProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class SiteMediaServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void storeImagePersistsFile() throws Exception {
        SiteMediaProperties properties = new SiteMediaProperties(tempDir.toString(), "/media/test");
        SiteMediaService service = new SiteMediaService(properties);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "example.png",
                "image/png",
                new byte[]{0x1, 0x2, 0x3}
        );

        String url = service.storeImage(file);
        assertTrue(url.startsWith("/media/test/"));

        String filename = url.substring("/media/test/".length());
        assertTrue(Files.exists(tempDir.resolve(filename)));
    }

    @Test
    void rejectNonImageFiles() {
        SiteMediaProperties properties = new SiteMediaProperties(tempDir.toString(), "/media/test");
        SiteMediaService service = new SiteMediaService(properties);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "notes.txt",
                "text/plain",
                "hello".getBytes()
        );

        assertThrows(ResponseStatusException.class, () -> service.storeImage(file));
    }
}
