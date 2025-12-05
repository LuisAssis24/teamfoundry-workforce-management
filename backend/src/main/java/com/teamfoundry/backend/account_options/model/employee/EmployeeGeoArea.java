package com.teamfoundry.backend.account_options.model.employee;

import com.teamfoundry.backend.account.model.EmployeeAccount;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "area_funcionario")
public class EmployeeGeoArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_funcionario", nullable = false)
    private EmployeeAccount employee;

    @ManyToOne
    @JoinColumn(name = "id_area_geo", nullable = false)
    private GeoArea geoArea;
}
