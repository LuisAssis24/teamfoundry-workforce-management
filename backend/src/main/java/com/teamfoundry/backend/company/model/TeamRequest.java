package com.teamfoundry.backend.company.model;

import com.teamfoundry.backend.company.enums.State;
import com.teamfoundry.backend.account.model.CompanyAccount;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "request_equipa")
public class TeamRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private CompanyAccount company;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private State state;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
