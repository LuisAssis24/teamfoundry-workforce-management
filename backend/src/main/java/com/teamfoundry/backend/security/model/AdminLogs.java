package com.teamfoundry.backend.security.model;

import com.teamfoundry.backend.account.model.AdminAccount;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "logs_admin")
public class AdminLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_admin", nullable = false)
    private AdminAccount admin;

    @Column(nullable = false)
    private String action;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
