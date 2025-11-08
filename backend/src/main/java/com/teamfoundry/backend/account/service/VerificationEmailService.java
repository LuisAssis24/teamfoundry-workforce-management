package com.teamfoundry.backend.account.service;

import com.teamfoundry.backend.account.service.exception.CandidateRegistrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Responsável por enviar os códigos de verificação via SMTP (Brevo).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@teamfoundry.com}")
    private String fromAddress;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    /**
     * Envia um e-mail simples com o código numérico.
     *
     * @param destination e-mail do candidato
     * @param code        código de 6 dígitos gerado pelo backend
     */
    public void sendVerificationCode(String destination, String code) {
        if (!mailEnabled) {
            log.warn("Envio de e-mail desativado (app.mail.enabled=false). Código {} para {}", code, destination);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(destination);
        message.setSubject("Código de verificação TeamFoundry");
        message.setText("Olá!\n\nO seu código de verificação é: " + code +
                "\n\nSe não realizou este pedido, ignore este e-mail.\n");

        try {
            mailSender.send(message);
            log.info("Código de verificação enviado para {}", destination);
        } catch (MailException ex) {
            log.error("Falha ao enviar e-mail de verificação para {}", destination, ex);
            throw new CandidateRegistrationException(
                    "Não foi possível enviar o e-mail de verificação. Tente novamente mais tarde.",
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
}
