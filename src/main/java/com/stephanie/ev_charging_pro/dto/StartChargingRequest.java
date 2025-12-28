package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class StartChargingRequest {
    private Long vehicleId;
    private Long stationId;

    private int startPercentage;
    private int targetPercentage;
}
