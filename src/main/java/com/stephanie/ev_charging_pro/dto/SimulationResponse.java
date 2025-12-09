package com.stephanie.ev_charging_pro.dto;

import lombok.Data;

@Data
public class SimulationResponse {

    public double lambda; //arrivals/hours
    public double mu; //service rate
    public double rho; //utilization
    public double Lq; //queue length
    public double Wq; //waiting time
    public double W; //total system time
    public int c; //chargers

    /*
     λ (lambda) = arrival rate
      μ (mu) = service rate
      ρ (rho) = utilization
      Lq = expected number in queue
      Wq = expected waiting time
      W = total time in system (wait + service)
      c (chargers)
      queue length estimate (based on traffic-level and time)
      */
}
