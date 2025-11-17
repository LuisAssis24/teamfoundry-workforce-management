package com.teamfoundry.backend;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    @Value("${spring.mail.host}")
    private String mailHost;

    @PostConstruct
    void logMailHost() {
        log.info("spring.mail.host = {}", mailHost);
    }

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
