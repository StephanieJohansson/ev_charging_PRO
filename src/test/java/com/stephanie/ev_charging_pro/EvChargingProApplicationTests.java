package com.stephanie.ev_charging_pro;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// integration test to test the whole application
// with h2 test database
@SpringBootTest
@ActiveProfiles("test")
class EvChargingProApplicationTests {

	@Test
	void contextLoads() {
	}

}
