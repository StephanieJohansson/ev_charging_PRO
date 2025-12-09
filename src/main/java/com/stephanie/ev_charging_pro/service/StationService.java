package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.StationDTO;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<Station> getAllStations(){
        return stationRepository.findAll();
    }

    public Station createStation(StationDTO stationDTO){

        Station station = Station.builder()
                .location(stationDTO.getLocation())
                .totalPlugs(stationDTO.getTotalPlugs())
                .avgChargeSeed(stationDTO.getAvgChargeSeed())
                .currentQueue(0)
                .estimatedWaitTime(0)
                .build();

        return stationRepository.save(station);
    }
}
