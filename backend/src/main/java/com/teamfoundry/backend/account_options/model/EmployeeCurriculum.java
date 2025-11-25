package com.teamfoundry.backend.account_options.model;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cv")
public class EmployeeCurriculum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "id_funcionario", nullable = false)
    private EmployeeAccount employee;

    @Column(name = "cv_url", nullable = false)
    private String cvUrl;
}
