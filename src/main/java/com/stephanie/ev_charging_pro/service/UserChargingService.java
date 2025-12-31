package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.*;
import com.stephanie.ev_charging_pro.model.ChargingSession;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.model.Vehicle;
import com.stephanie.ev_charging_pro.repository.ChargingSessionRepository;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.repository.VehicleRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Service
public class UserChargingService {

    private final SimulationService simulationService;
    private final ChargingTimeCalculator chargingTimeCalculator;
    private final ChargingSessionRepository chargingSessionRepository;
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;


    public UserChargingService(SimulationService simulationService,
                               UserRepository userRepository,
                               VehicleRepository vehicleRepository,
                               ChargingTimeCalculator chargingTimeCalculator,
                               ChargingSessionRepository chargingSessionRepository,
                               StationRepository stationRepository) {
        this.simulationService = simulationService;
        this.chargingTimeCalculator = chargingTimeCalculator;
        this.chargingSessionRepository = chargingSessionRepository;
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;

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

    // Helper method to get the currently authenticated user
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }



    public ChargingSession startCharging(StartChargingRequest request) {

        User user = getCurrentUser();

        // block multiple active sessions
        chargingSessionRepository
                .findByUserAndEndTimeIsNull(user)
                .ifPresent(s -> {
                    throw new IllegalStateException("Charging already in progress");
                });

        Vehicle vehicle = vehicleRepository
                .findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Station station = stationRepository
                .findById(request.getStationId())
                .orElseThrow(() -> new IllegalArgumentException("Station not found"));

        ChargingSession session = new ChargingSession();
        session.setUser(user);
        session.setVehicle(vehicle);
        session.setStation(station);
        session.setStartTime(LocalDateTime.now());
        session.setStartPercentage(request.getStartPercentage());
        session.setEndPercentage(request.getTargetPercentage());

        return chargingSessionRepository.save(session);
    }





    public ChargingSession stopCharging(StopChargingRequest request) {

        User user = getCurrentUser();

        ChargingSession session = chargingSessionRepository
                .findById(request.getSessionId())
                .orElseThrow(() -> new IllegalStateException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Not your session");
        }

        session.setEndTime(LocalDateTime.now());
        session.setEndPercentage(request.getEndPercentage());

        double energyDelivered =
                session.getVehicle().getBatteryCapacity() *
                        (session.getEndPercentage() - session.getStartPercentage()) / 100.0;

        session.setEnergyKWh(energyDelivered);

        long durationMinutes =
                Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();

        session.setDurationMinutes(durationMinutes);

        return chargingSessionRepository.save(session);
    }


}
