package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.StationDTO;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.service.StationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
@CrossOrigin
public class StationController {

    // service for station CRUD operations
    private final StationService stationService;

    // constructor
    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    // endpoint to get all stations for everyone to see
    @GetMapping
    public List<Station> getAllStations(){
        return stationService.getAllStations();
    }



}
