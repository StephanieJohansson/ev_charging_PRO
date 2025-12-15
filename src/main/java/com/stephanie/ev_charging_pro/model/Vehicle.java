package com.stephanie.ev_charging_pro.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private String brand;
    private String model;
    private String plateNumber;

    private int batteryCapacity;
    private int currentBatteryLevel;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("vehicles") // to stop loop
    private User owner;
}
