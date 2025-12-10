package com.stephanie.ev_charging_pro.dto;


import lombok.Data;

@Data
public class VehicleRequest {
    private String brand;
    private String model;
    private String plateNumber;
    private int batteryCapacity;
}
