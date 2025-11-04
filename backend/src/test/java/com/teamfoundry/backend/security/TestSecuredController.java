package com.teamfoundry.backend.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Controller disponível apenas no classpath de testes para validar proteção via JWT
@RestController
@RequestMapping("/secured")
public class TestSecuredController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}

