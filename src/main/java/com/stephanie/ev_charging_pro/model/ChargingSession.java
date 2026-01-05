package com.stephanie.ev_charging_pro.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class ChargingSession {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Station station;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private double startPercentage;
    private double endPercentage;

    private double energyKWh;
    private double durationMinutes;
    private double totalCost;

    @ManyToOne
    private User user;
}
