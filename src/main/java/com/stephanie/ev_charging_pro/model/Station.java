package com.stephanie.ev_charging_pro.model;

import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "stations")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String location; /*ex gothenburg central station*/
    private int totalPlugs; /*ex 6 load-plugs*/
    private double avgChargeSeed; /*ex 22 KW*/

    private int currentQueue; /*cars in queue*/
    private int estimatedWaitTime; /*in minutes*/

    @Column(name = "price_per_kwh", nullable = false)
    private double pricePerKWh; /*ex 3.50 SEK/KWh*/
}
