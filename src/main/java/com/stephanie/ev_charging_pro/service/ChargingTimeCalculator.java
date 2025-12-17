package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.model.Vehicle;
import org.springframework.stereotype.Service;

@Service
public class ChargingTimeCalculator {

    public double calculateChargingMinutes(
            Vehicle vehicle,
            Station station,
            int startPercentage,
            int endPercentage
    ) {

        double batteryKWh = vehicle.getBatteryCapacity();
        double delta = (endPercentage - startPercentage) / 100.0;
        double neededKWh = batteryKWh * delta;

        double effectivePower = station.getAvgChargeSeed(); // kW

        // effective power decreases as battery fills up
        if (endPercentage > 80) {
            effectivePower *= 0.7;
        }

        double chargingHours = neededKWh / effectivePower;
        double chargingMinutes = chargingHours * 60.0;

        // DEBUG
        System.out.println("=== CHARGING CALC ===");
        System.out.println("Battery kWh: " + batteryKWh);
        System.out.println("Delta: " + delta);
        System.out.println("Needed kWh: " + neededKWh);
        System.out.println("Effective power kW: " + effectivePower);
        System.out.println("Charging minutes: " + chargingMinutes);

        return chargingMinutes;
    }
}
