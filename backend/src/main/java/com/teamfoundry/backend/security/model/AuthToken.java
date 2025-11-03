package com.teamfoundry.backend.security.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "auth_token")
@PrimaryKeyJoinColumn(name = "id")
public class AuthToken extends Token {

    @Column(name = "refresh_token", nullable = false)
    private String refreshToken;
}
