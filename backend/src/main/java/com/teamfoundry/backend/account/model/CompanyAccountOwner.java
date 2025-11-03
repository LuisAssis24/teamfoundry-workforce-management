package com.teamfoundry.backend.account.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "responsavel_conta")
public class CompanyAccountOwner {

    @Id
    @OneToOne
    @JoinColumn(name = "id_empresa", referencedColumnName = "id", nullable = false)
    private CompanyAccount companyAccount;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String position;
}
