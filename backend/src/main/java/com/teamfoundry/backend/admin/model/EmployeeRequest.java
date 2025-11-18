package com.teamfoundry.backend.admin.model;

import com.teamfoundry.backend.admin.enums.State;
import com.teamfoundry.backend.account.model.AdminAccount;
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
    @JoinColumn(name = "id_team_request", nullable = false)
    private TeamRequest teamRequest;

    @Column(name = "requested_role", nullable = false)
    private String requestedRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private State state;

    @Column(name = "date_accepted", nullable = false)
    private LocalDateTime acceptedDate;
}
