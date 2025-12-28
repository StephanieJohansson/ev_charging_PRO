package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class StopChargingRequest {
    private Long sessionId;
    private int endPercentage;
}
