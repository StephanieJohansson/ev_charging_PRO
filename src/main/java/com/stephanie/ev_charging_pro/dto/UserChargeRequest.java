package com.stephanie.ev_charging_pro.dto;

public class UserChargeRequest {

    private Long vehicleId;
    private Long stationId;

    private int startPercentage;
    private int endPercentage;


    // Getters and Setters
    public Long getVehicleId() {
        return vehicleId;
    }
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    public Long getStationId() {
        return stationId;
}
    public void setStationId(Long stationId) {
        this.stationId = stationId;
    }
    public int getStartPercentage() {
        return startPercentage;
    }
    public void setStartPercentage(int startPercentage) {
        this.startPercentage = startPercentage;
    }
    public int getEndPercentage() {
        return endPercentage;
    }
    public void setEndPercentage(int endPercentage) {
        this.endPercentage = endPercentage;
    }
}
