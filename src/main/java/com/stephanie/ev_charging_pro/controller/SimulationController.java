package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.SimulationRequest;
import com.stephanie.ev_charging_pro.dto.SimulationResponse;
import com.stephanie.ev_charging_pro.service.SimulationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sim")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {

        this.simulationService = simulationService;
    }

    @PostMapping
    public SimulationResponse simulate(@RequestBody SimulationRequest req) {

        return simulationService.simulate(req);
    }

    @GetMapping
    public SimulationResponse getSimulation() {
        return simulationService.getLastSimulation();
    }
}
