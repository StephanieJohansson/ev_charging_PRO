package com.stephanie.ev_charging_pro.service;


import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VehicleSpecResolver {

    private static final Map<String, Double> BATTERY_MAP = Map.ofEntries(
            Map.entry("Tesla_Model3", 75.0),
            Map.entry("Nissan_Leaf", 40.0),
            Map.entry("Chevrolet_Bolt", 66.0),
            Map.entry("BMW_i3", 42.2),
            Map.entry("Audi_e-tron", 95.0)
    );

    private static final double MIN_KWH = 40.0;
    private static final double MAX_KWH = 100.0;

    public double resolveBatteryCapacity(String brand, String model) {
        String key = (brand + "_" + model).trim();

        if (BATTERY_MAP.containsKey(key)) {
            return BATTERY_MAP.get(key);
        }

        return generateRandomBatteryCapacity();

    }

    private double generateRandomBatteryCapacity() {
        return Math.round(
                (MIN_KWH + Math.random() * (MAX_KWH - MIN_KWH)) * 10
        ) / 10.0;
    }
}
