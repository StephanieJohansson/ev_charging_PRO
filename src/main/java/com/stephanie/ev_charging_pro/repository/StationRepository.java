package com.stephanie.ev_charging_pro.repository;

import com.stephanie.ev_charging_pro.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {

    Station findByLocation(String location);
}