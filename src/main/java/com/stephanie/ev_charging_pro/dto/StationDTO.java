package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class StationDTO {
    private Long id;
    private String location;
    private int totalPlugs;
    private double avgChargeSeed;
    private int currentQueue;
    private int estimatedWaitTime;
    private double pricePerKWh;
}
