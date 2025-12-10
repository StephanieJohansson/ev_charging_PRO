package com.stephanie.ev_charging_pro.security;


import com.stephanie.ev_charging_pro.model.Role;
import com.stephanie.ev_charging_pro.model.Station;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.repository.StationRepository;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


// component to seed the database with some dummy data
@Component
public class DataSeeder {

    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(StationRepository stationRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.stationRepository = stationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // postConstruct method to seed the database
    @PostConstruct
    public void init() {
        if (stationRepository.count() == 0){
            stationRepository.save(Station.builder()
                    .location("Söderhamn Supercharger")
                    .totalPlugs(20) //tesla
                    .avgChargeSeed(150) //150kW is standard to V2/V3
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());

            // dummy station with fewer plugs and lower average charge seed
            stationRepository.save(Station.builder()
                    .location("Bollnäs centrum")
                    .totalPlugs(4)
                    .avgChargeSeed(22) // 22 kW AC-charger
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());

            // dummy station, one or two fast chargers
            stationRepository.save(Station.builder()
                    .location("Hudiksvall Cirkel K")
                    .totalPlugs(6)
                    .avgChargeSeed(50) // 50 kW DC-charger
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());

            // dummy station, HPC - higher power charging among E4 road
            stationRepository.save(Station.builder()
                    .location("Ionity Hudiksvall")
                    .totalPlugs(6)
                    .avgChargeSeed(350)  // 350 kW - Supercharger
                    .currentQueue(0)
                    .estimatedWaitTime(0)
                    .build());
        }
        // 2. Seed Admin User
        if (userRepository.count() == 0) {
            // create admin user
            User admin = User.builder()
                    .username("Admin")
                    .email("admin@mail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
        }
    }
}
