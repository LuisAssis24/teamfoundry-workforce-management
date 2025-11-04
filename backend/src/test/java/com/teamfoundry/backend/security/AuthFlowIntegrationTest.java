package com.teamfoundry.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamfoundry.backend.account.enums.UserType;
import com.teamfoundry.backend.account.model.Account;
import com.teamfoundry.backend.account.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Auth Flow")
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class AuthFlowIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(AuthFlowIntegrationTest.class);

    @Autowired
    MockMvc mockMvc;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ObjectMapper objectMapper;

    private final String email = "user@test.com";
    private final String rawPassword = "secret";

    @BeforeEach
    void setupUser() {
        accountRepository.deleteAll();
        Account acc = new Account();
        acc.setEmail(email);
        acc.setPassword(passwordEncoder.encode(rawPassword));
        acc.setNif(123456789);
        acc.setRole(UserType.EMPLOYEE);
        accountRepository.save(acc);
    }

    @Test
    @DisplayName("Login success → retorna tokens")
    void login_success_returnsTokens() throws Exception {
        var body = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", rawPassword
        ));

        var result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acessToken").isString())
                .andExpect(jsonPath("$.refreshToken").isString())
                .andExpect(jsonPath("$.expiresIn").isNumber())
                .andExpect(jsonPath("$.role").value("EMPLOYEE"))
                .andReturn();

        var json = result.getResponse().getContentAsString();
        log.info("✅ Login SUCCESS: {}", json);
    }

    @Test
    @DisplayName("Login inválido → 401 Unauthorized")
    void login_invalidCredentials_unauthorized() throws Exception {
        var body = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", "wrong"
        ));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isUnauthorized());
        log.info("✅ Login INVALIDO: retornou 401 conforme esperado");
    }

    @Test
    @DisplayName("Refresh válido → retorna novo access token")
    void refresh_withValidToken_returnsNewAccessToken() throws Exception {
        // Login primeiro
        var loginBody = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", rawPassword
        ));

        var loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        var loginJson = loginResult.getResponse().getContentAsString();
        var map = objectMapper.readValue(loginJson, Map.class);
        String refresh = (String) map.get("refreshToken");
        assertThat(refresh).as("refresh token deve existir").isNotBlank();

        var refreshBody = objectMapper.writeValueAsString(Map.of("refreshToken", refresh));

        var refreshResult = mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshBody))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.acessToken").isString())
                .andExpect(jsonPath("$.refreshToken").value(refresh))
                .andReturn();

        log.info("✅ Refresh SUCCESS: {}", refreshResult.getResponse().getContentAsString());
    }

    @Test
    @DisplayName("Endpoint protegido → exige Bearer e aceita JWT válido")
    void protectedEndpoint_requiresBearer_andAcceptsValidJwt() throws Exception {
        // sem token -> 401
        mockMvc.perform(get("/secured/ping"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isUnauthorized());

        // login para obter access token
        var loginBody = objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", rawPassword
        ));
        var loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        var loginJson = loginResult.getResponse().getContentAsString();
        var map = objectMapper.readValue(loginJson, Map.class);
        String access = (String) map.get("acessToken");

        mockMvc.perform(get("/secured/ping").header("Authorization", "Bearer " + access))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));

        log.info("✅ Protected SUCCESS: Bearer aceito e endpoint respondeu pong");
    }
}
