package com.teamfoundry.backend.account.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conta_funcionario")
@PrimaryKeyJoinColumn(name = "id")
public class EmployeeAccount extends Account {

    @Column
    private String name;

    @Column
    private String surname;

    @Column
    private String phone;

    @Column
    private String nationality;

    @Column
    private String gender;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "profile_picture_public_id")
    private String profilePicturePublicId;
}
