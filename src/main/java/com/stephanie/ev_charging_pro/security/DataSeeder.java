package com.stephanie.ev_charging_pro.security;


import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;


// component to seed the database with some dummy data
@Component
public class DataSeeder {

    private final StationRepository stationRepository;

    public DataSeeder(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    // postConstruct method to seed the database
    @PostConstruct
    public void init() {
        if (stationRepository.count() == 0){
            stationRepository.save(Station.builder()
                    .location("Söderhamn")
                    .totalPlugs(6)
                    .avgChargeSeed(22)
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());

            // add more stations
            stationRepository.save(Station.builder()
                    .location("Bollnäs")
                    .totalPlugs(8)
                    .avgChargeSeed(50)
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());

            // add more stations
            stationRepository.save(Station.builder()
                    .location("Hudiksvall")
                    .totalPlugs(4)
                    .avgChargeSeed(11)
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());
        }
    }
}
