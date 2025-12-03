package com.stephanie.ev_charging_pro.repository;

import com.stephanie.ev_charging_pro.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByOwnerId(Long userId);
}