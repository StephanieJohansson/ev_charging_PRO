package com.stephanie.ev_charging_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserChargeResponse {

    private double queueTimeMinutes;
    private double chargingTimeMinutes;
    private double totalTimeMinutes;


}
