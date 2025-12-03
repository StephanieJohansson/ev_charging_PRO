package com.stephanie.ev_charging_pro.model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String model;
    private int batteryCapacity;
    private int currentBatteryLevel;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
