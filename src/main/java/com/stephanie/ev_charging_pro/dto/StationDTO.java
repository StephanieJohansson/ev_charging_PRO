package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class StationDTO {
    private String location;
    private int totalPlugs;
    private double avgChargeSeed;
    private double pricePerKWh;
}
