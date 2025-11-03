package com.teamfoundry.backend.account_options.model;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "competencias_funcionario")
public class EmployeeCompetence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_funcionario", nullable = false)
    private EmployeeAccount employee;

    @ManyToOne
    @JoinColumn(name = "id_competencia", nullable = false)
    private Competence competence;
}
