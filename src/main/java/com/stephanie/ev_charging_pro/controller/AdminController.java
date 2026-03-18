package com.stephanie.ev_charging_pro.controller;

import com.stephanie.ev_charging_pro.dto.StationDTO;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.service.StationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StationService stationService;
    private final UserRepository userRepository;

    public AdminController(StationService stationService, UserRepository userRepository) {

        this.stationService = stationService;
        this.userRepository = userRepository;
    }

    // let admin see all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // let admin create new stations
    @PostMapping("/stations")
    public ResponseEntity<Station> createStation(@RequestBody StationDTO stationDTO) {
        Station newStation = stationService.createStation(stationDTO);
        return ResponseEntity.ok(newStation);
    }

    // let admin delete stations
    @DeleteMapping("/stations/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
    }

    // let admin update stations
    @PutMapping("/stations/{id}")
    public ResponseEntity<Station> updateStation(@PathVariable Long id, @RequestBody StationDTO stationDTO) {
        Station updatedStation = stationService.updateStation(id, stationDTO);
        return ResponseEntity.ok(updatedStation);
    }
}