package com.teamfoundry.backend.account_options.model.company;

import com.teamfoundry.backend.account.model.CompanyAccount;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "setores_atividade_empresa")
public class CompanyActivitySectors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private CompanyAccount company;

    @ManyToOne
    @JoinColumn(name = "id_setor", nullable = false)
    private ActivitySectors sector;
}
