package com.stephanie.ev_charging_pro.service;

import com.stephanie.ev_charging_pro.dto.VehicleRequest;
import com.stephanie.ev_charging_pro.exception.BadRequestException; // Eller EntityNotFoundException
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.model.Vehicle;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.repository.VehicleRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleSpecResolver vehicleSpecResolver;

    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository, VehicleSpecResolver vehicleSpecResolver) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.vehicleSpecResolver = vehicleSpecResolver;
    }

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // FIX 1: Ta bort .get() här!
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    // FIX 2: Ändra parameter från Vehicle till VehicleRequest
    public Vehicle createVehicle(VehicleRequest req){
        if (req.getPlateNumber() == null || req.getPlateNumber().isBlank()) {
            throw new BadRequestException("Plate number is required");
        }

        User user = getCurrentUser();

        double batteryCapacity =
                req.getBatteryCapacity() != null && req.getBatteryCapacity() > 0
                        ? req.getBatteryCapacity()
                        : vehicleSpecResolver.resolveBatteryCapacity(
                        req.getBrand(),
                        req.getModel()
                );

        Vehicle vehicle = Vehicle.builder()
                .brand(req.getBrand())
                .model(req.getModel())
                .plateNumber(req.getPlateNumber())
                .batteryCapacity(batteryCapacity)
                .owner(user)
                .currentBatteryLevel(50)
                .build();

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getMyVehicles(){

        return vehicleRepository.findByOwner(getCurrentUser());
    }
}