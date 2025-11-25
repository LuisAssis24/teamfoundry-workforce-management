package com.teamfoundry.backend.admin.model;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import com.teamfoundry.backend.admin.enums.State;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ligacao_funcionario")
public class EmployeeRequestEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_request", nullable = false)
    private EmployeeRequest employeeRequest;

    @ManyToOne
    @JoinColumn(name = "id_funcionario", nullable = false)
    private EmployeeAccount employee;

    @Column(nullable = false)
    private boolean active;
}
