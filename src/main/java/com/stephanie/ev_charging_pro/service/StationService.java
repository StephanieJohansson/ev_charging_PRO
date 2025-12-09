package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.SimulationRequest;
import com.stephanie.ev_charging_pro.dto.SimulationResponse;
import com.stephanie.ev_charging_pro.dto.StationDTO;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;
    private final SimulationService simulationService;

    public StationService(StationRepository stationRepository, SimulationService simulationService) {
        this.stationRepository = stationRepository;
        this.simulationService = simulationService;
    }

    public List<Station> getAllStations(){
        List<Station> stations = stationRepository.findAll();
        // loop through stations and calculate real-time status
        for(Station station : stations){
            calculateRealTimeStatus(station);
        }

        return stations;
    }

    private void calculateRealTimeStatus(Station station) {
        int currentHour = LocalTime.now().getHour(); // get current hour of the day

        // Guess traffic based on the time of the day
        String traffic = "low";
        if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 16 && currentHour <= 19)) {
            traffic = "high";
        } else if (currentHour > 9 && currentHour < 16) {
            traffic = "medium";
        }


        // Prepare simulation request
        SimulationRequest req = new SimulationRequest();
        req.setStationPowerKw(station.getAvgChargeSeed());
        req.setConnectors(station.getTotalPlugs());
        req.setBaseServiceMinutes(30); // Antag snittladdning tar 30 min
        req.setTemperatureC(10);       // Hårdkoda temp eller hämta från väder-API
        req.setHourOfDay(currentHour);
        req.setTrafficLevel(traffic);

        // run simulation
        SimulationResponse res = simulationService.simulate(req);

        // Overload handler
        // check if waitTime is extreamly high or infinit
        if (Double.isInfinite(res.getWq()) || res.getWq() > 1000) {
            station.setEstimatedWaitTime(999); // Kod för "Jättelång väntetid"
            station.setCurrentQueue(99);       // Kod för "Fullt"
        } else {
            // convert waitTime to minutes
            // res.getWq() is in hours, * 60 to get minutes
            int minutesWait = (int) Math.round(res.getWq() * 60);

            // getWq = Waiting time in queue
            // getLq = Length of Queue
            station.setEstimatedWaitTime((int) Math.round(res.getWq()));
            station.setCurrentQueue((int) Math.round(res.getLq()));
        }
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
