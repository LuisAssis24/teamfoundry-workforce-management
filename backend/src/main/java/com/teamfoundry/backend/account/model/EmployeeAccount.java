package com.teamfoundry.backend.account.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conta_funcionario")
@PrimaryKeyJoinColumn(name = "id")
public class EmployeeAccount extends Account {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String nationality;

    @Column(nullable = false)
    private String gender;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;
}
