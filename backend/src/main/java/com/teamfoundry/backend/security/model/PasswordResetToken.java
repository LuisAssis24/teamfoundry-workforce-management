package com.teamfoundry.backend.security.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "password_reset_token")
@PrimaryKeyJoinColumn(name = "id")
public class PasswordResetToken extends Token {
}

