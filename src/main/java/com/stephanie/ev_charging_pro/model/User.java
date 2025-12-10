package com.stephanie.ev_charging_pro.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;
}
