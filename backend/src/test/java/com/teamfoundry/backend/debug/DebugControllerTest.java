package com.teamfoundry.backend.debug;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DebugControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/debug/ping deve responder com status ok")
    void ping() throws Exception {
        mockMvc.perform(get("/api/debug/ping"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    @DisplayName("POST /api/debug/echo devolve payload recebido")
    void echo() throws Exception {
        mockMvc.perform(post("/api/debug/echo")
                        .contentType("application/json")
                        .content("{\"msg\":\"test\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.received.msg").value("test"));
    }
}
