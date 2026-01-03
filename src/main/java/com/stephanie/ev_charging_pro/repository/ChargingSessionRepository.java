package com.stephanie.ev_charging_pro.repository;

import com.stephanie.ev_charging_pro.model.ChargingSession;
import com.stephanie.ev_charging_pro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {

    Optional<ChargingSession> findByUserIdAndEndTimeIsNull(Long userID);

}
