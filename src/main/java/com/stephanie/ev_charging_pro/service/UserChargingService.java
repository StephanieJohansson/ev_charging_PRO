package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.SimulationRequest;
import com.stephanie.ev_charging_pro.dto.SimulationResponse;
import com.stephanie.ev_charging_pro.dto.UserChargeResponse;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.model.Vehicle;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class UserChargingService {

    private final SimulationService simulationService;
    private final ChargingTimeCalculator chargingTimeCalculator;

    public UserChargingService(SimulationService simulationService, ChargingTimeCalculator chargingTimeCalculator) {
        this.simulationService = simulationService;
        this.chargingTimeCalculator = chargingTimeCalculator;
    }

    public UserChargeResponse estimateCharge(
            Vehicle vehicle,
            Station station,
            int startPercentage,
            int endPercentage
    ){
        double batteryKWh = vehicle.getBatteryCapacity();
        double neededKWh = batteryKWh * (endPercentage - startPercentage) / 100.0;

        double chargingHours = neededKWh / station.getAvgChargeSeed();
        double chargingMinutes =
                chargingTimeCalculator.calculateChargingMinutes(
                        vehicle,
                        station,
                        startPercentage,
                        endPercentage
                );


        SimulationRequest queueRequest = new SimulationRequest();

        queueRequest.setStationPowerKw(station.getAvgChargeSeed());
        queueRequest.setConnectors(station.getTotalPlugs());
        queueRequest.setBaseServiceMinutes(chargingMinutes);
        queueRequest.setHourOfDay(LocalTime.now().getHour());
        queueRequest.setTrafficLevel("medium"); // for simplicity, I use medium traffic level
        queueRequest.setTemperatureC(10);


        SimulationResponse simulationResponse = simulationService.simulate(queueRequest);

      double queueMinutes = 10;


        return new UserChargeResponse(
                queueMinutes,
                chargingMinutes,
                queueMinutes + chargingMinutes
        );

    }

}
