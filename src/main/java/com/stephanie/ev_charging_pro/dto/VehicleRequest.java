package com.stephanie.ev_charging_pro.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NonNull;

@Data
public class VehicleRequest {
    private String brand;
    private String model;
    private String plateNumber;
    @NonNull
    @Min(20)
    @Max(120)
    private Integer batteryCapacity;
}
