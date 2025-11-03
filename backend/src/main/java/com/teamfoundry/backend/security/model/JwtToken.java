package com.teamfoundry.backend.security.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jwt_token")
@PrimaryKeyJoinColumn(name = "id")
public class JwtToken extends Token {

    @Column(nullable = false)
    private String jwtId;
}
