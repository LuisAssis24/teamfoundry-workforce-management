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
@Table(name = "request_funcionario")
public class EmployeeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private CompanyAccount company;

    @Column(name = "requested_role", nullable = false)
    private String requestedRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private State state;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
