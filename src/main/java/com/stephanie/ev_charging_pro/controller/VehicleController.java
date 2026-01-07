package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.VehicleRequest;
import com.stephanie.ev_charging_pro.model.Vehicle;
import com.stephanie.ev_charging_pro.service.VehicleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public Vehicle createVehicle(@RequestBody VehicleRequest req){
        return vehicleService.createVehicle(req);
    }

    @GetMapping
    public List<Vehicle> getAllVehicles(){
        return vehicleService.getMyVehicles();
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id){
        vehicleService.deleteVehicle(id);
    }
}
