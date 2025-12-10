package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.SimulationResponse;
import com.stephanie.ev_charging_pro.dto.SimulationRequest;
import org.springframework.stereotype.Service;

@Service
public class SimulationService {

    public SimulationResponse simulate(SimulationRequest req) {

        double lambda = calculateLambda(req.getTrafficLevel(), req.getHourOfDay());
        double mu = calculateMu(req.getStationPowerKw(), req.getBaseServiceMinutes(), req.getTemperatureC());
        int c = req.getConnectors();

        SimulationResponse res;

        // calculate simulation results
        if (c == 1) {
            res = mm1(lambda, mu);
        } else {
            res = mmc(lambda, mu, c);
        }

        res.c = c;
        return res;
    }

    // calculate lambda based on traffic level and hour of day
    private double calculateLambda(String traffic, int hour) {

        double base = switch (traffic.toLowerCase()) {
            case "low" -> 2;       // 2 cars/hour
            case "medium" -> 5;    // 5 cars/hour
            case "high" -> 12;     // 12 cars/hour
            default -> 3;
        };

        if (hour >= 16 && hour <= 19) {
            base *= 1.5; // rush hour boost
        }

        return base;
    }

// calculate mu based on station power, base service minutes and temperature
    public double calculateMu(double powerKw, double baseMinutes, double tempC) {

        // Temperature effect
        if (tempC < 0) baseMinutes *= 1.3;
        else if (tempC < 10) baseMinutes *= 1.1;

        // Higher power = faster charging
        double adjustedMinutes = baseMinutes * (50.0 / powerKw);

        return 60.0 / adjustedMinutes; // cars per hour
    }

    // M/M/1 queue model
    public SimulationResponse mm1(double lambda, double mu) {

        SimulationResponse r = new SimulationResponse();

        r.setLambda(lambda);
        r.setMu(mu);
        r.setRho(lambda / mu);

        if (r.getRho() >= 1) {
            r.setLq(Double.POSITIVE_INFINITY);
            r.setWq(Double.POSITIVE_INFINITY);
            r.setW(Double.POSITIVE_INFINITY);
            return r;
        }

        r.setLq((Math.pow(lambda, 2)) / (mu * (mu - lambda)));
        r.setWq(r.getLq() / lambda);
        r.setW(r.getWq() + (1 / mu));

        return r;
    }

    // M/M/c queue model
    private SimulationResponse mmc(double lambda, double mu, int c) {

        SimulationResponse r = new SimulationResponse();

        double rho = lambda / (c * mu);
        r.setLambda(lambda);
        r.setMu(mu);
        r.setRho(rho);

        if (rho >= 1) {
            r.setLq(Double.POSITIVE_INFINITY);
            r.setWq(Double.POSITIVE_INFINITY);
            r.setW(Double.POSITIVE_INFINITY);
            return r;
        }

        double sum = 0;

        // calculate sum of first n terms of the series
        for (int n = 0; n < c; n++) {
            sum += Math.pow(lambda/mu, n) / factorial(n);
        }

        // calculate p0 (steady-state probability of 0 cars in system)
        double p0 = 1 / (sum + (Math.pow(lambda/mu, c) / (factorial(c) * (1 - rho))));

        // calculate erlangC (probability that arriving customer has to wait)
        double erlangC =
                (Math.pow(lambda/mu, c) / (factorial(c) * (1 - rho))) * p0;

        // Använd setters här nere också!
        r.setWq((erlangC * (1 / mu)) / (c * (1 - rho)));
        r.setW(r.getWq() + (1 / mu));
        r.setLq(r.getWq() * lambda);

        return r;
    }

    // calculate factorial
    private double factorial(int n) {
        return (n <= 1) ? 1 : n * factorial(n - 1);
    }

}