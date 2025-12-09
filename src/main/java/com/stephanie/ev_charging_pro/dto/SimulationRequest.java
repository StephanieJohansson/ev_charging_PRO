package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class SimulationRequest {

    private int hourOfDay;
    private String trafficLevel;
    private double temperatureC;
    private double baseServiceMinutes;
    private double stationPowerKw;
    private int connectors; // plugs
}
