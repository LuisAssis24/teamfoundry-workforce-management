package com.teamfoundry.backend.account.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "conta_empresa")
@PrimaryKeyJoinColumn(name = "id")
public class CompanyAccount extends Account {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String country;

    private String phone;

    private String website;

    private String description;

    @Column(nullable = false)
    private boolean status; // estado
}
