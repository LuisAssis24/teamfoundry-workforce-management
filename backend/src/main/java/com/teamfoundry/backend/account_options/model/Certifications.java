package com.teamfoundry.backend.account_options.model;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "formacao")
public class Certifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_funcionario", nullable = false)
    private EmployeeAccount employee;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "certificate_url")
    private String certificateUrl;
}
