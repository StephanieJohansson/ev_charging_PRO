package com.stephanie.ev_charging_pro;

import com.stephanie.ev_charging_pro.dto.SimulationResponse;
import com.stephanie.ev_charging_pro.service.SimulationService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

 // JUNIT TEST
public class testMM1Formula{
@Test
void testMM1Formula() {
    SimulationService sim = new SimulationService();
    SimulationResponse r = sim.mm1(2, 5);
    assertTrue(r.W > 0);
    assertTrue(r.rho < 1);
}
 }