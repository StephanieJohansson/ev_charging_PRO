package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.StartChargingRequest;
import com.stephanie.ev_charging_pro.dto.StopChargingRequest;
import com.stephanie.ev_charging_pro.dto.UserChargeRequest;
import com.stephanie.ev_charging_pro.dto.UserChargeResponse;
import com.stephanie.ev_charging_pro.exception.BadRequestException;
import com.stephanie.ev_charging_pro.model.ChargingSession;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.model.Vehicle;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.repository.VehicleRepository;
import com.stephanie.ev_charging_pro.service.UserChargingService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/charging")
@CrossOrigin(origins = "http://localhost:5173")
public class ChargingController {

    private final UserChargingService userChargingService;
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;

    public ChargingController(
            UserChargingService userChargingService,
            VehicleRepository vehicleRepository,
            StationRepository stationRepository,
            UserRepository userRepository
    ) {
        this.userChargingService = userChargingService;
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/estimate")
    public UserChargeResponse estimateCharge(@RequestBody UserChargeRequest request) {

        // get logged in user
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // get vehicle
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new BadRequestException("Vehicle not found"));

        // check vehicle ownership to user
        if (!vehicle.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Vehicle does not belong to user");
        }

        // get station
        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new BadRequestException("Station not found"));

        System.out.println("=== CHARGING DEBUG ===");
        System.out.println("Battery kWh: " + vehicle.getBatteryCapacity());
        System.out.println("Start %: " + request.getStartPercentage());
        System.out.println("End %: " + request.getEndPercentage());
        System.out.println(
                "Delta: " + ((request.getEndPercentage() - request.getStartPercentage()) / 100.0)
        );
        System.out.println("Station avgChargeSeed: " + station.getAvgChargeSeed());



        // validate charge percentages
        if (request.getStartPercentage() < 0 ||
                request.getEndPercentage() > 100 ||
                request.getStartPercentage() >= request.getEndPercentage()) {
            throw new BadRequestException("Invalid charge percentage range");
        }

        // estimate charge
        return userChargingService.estimateCharge(
                vehicle,
                station,
                request.getStartPercentage(),
                request.getEndPercentage()
        );

    }
    @PostMapping("/start")
    public ChargingSession startCharging(@RequestBody StartChargingRequest request) {
        return userChargingService.startCharging(request);
    }

    @PostMapping("/stop")
    public ChargingSession stopCharging(@RequestBody StopChargingRequest request) {
        return userChargingService.stopCharging(request);
    }

    @GetMapping("/active")
    public ChargingSession getActiveChargingSession() {
        return userChargingService.getActiveSession();
    }


}

