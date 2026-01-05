package com.stephanie.ev_charging_pro.repository;

import com.stephanie.ev_charging_pro.model.ChargingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {

    Optional<ChargingSession> findByUserIdAndEndTimeIsNull(Long userID);

    List<ChargingSession> findByUserIdAndEndTimeIsNotNullOrderByStartTimeDesc(Long userID);


    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}
