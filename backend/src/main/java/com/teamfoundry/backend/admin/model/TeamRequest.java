package com.teamfoundry.backend.admin.model;

import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.account.model.CompanyAccount;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

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

    @Column(name = "id_responsible_admin")
    private Integer responsibleAdminId;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
