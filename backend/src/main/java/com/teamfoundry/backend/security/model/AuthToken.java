package com.teamfoundry.backend.security.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "auth_token")
@PrimaryKeyJoinColumn(name = "id")
public class AuthToken extends Token {
    // Usa o campo 'token' herdado para armazenar o refresh token
}
