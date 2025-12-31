// src/components/ChargeForm.jsx
import { useEffect, useState } from "react";
import api from "../api/api";

export default function ChargeForm({ vehicles }) {
    const [stations, setStations] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [stationId, setStationId] = useState("");
    const [start, setStart] = useState(20);
    const [end, setEnd] = useState(80);

    const [preview, setPreview] = useState(null);
    const [activeSession, setActiveSession] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Live charging UI state
    const [currentPercentage, setCurrentPercentage] = useState(null);
    const [remainingMinutes, setRemainingMinutes] = useState(null);
    const [estimatedMinutes, setEstimatedMinutes] = useState(null);

    const TIME_SCALE = 1; // 1 sekund = 1 minut
    const TICK_MS = 1000;

    // Load stations + check active session
    useEffect(() => {
        api.get("/stations").then(res => setStations(res.data));

        api.get("/charging/active")
            .then(res => setActiveSession(res.data))
            .catch(() => {});
    }, []);

    // If session exists but we lost estimate (reload), re-fetch estimate
    useEffect(() => {
        if (!activeSession || estimatedMinutes) return;

        api.post("/charging/estimate", {
            vehicleId: activeSession.vehicle.id,
            stationId: activeSession.station.id,
            startPercentage: activeSession.startPercentage,
            endPercentage: activeSession.endPercentage
        }).then(res => {
            setEstimatedMinutes(res.data.totalTimeMinutes);
        });
    }, [activeSession, estimatedMinutes]);

    // Simulate live charging
    useEffect(() => {
        if (!activeSession || !estimatedMinutes) return;

        const startPct = activeSession.startPercentage;
        const endPct = activeSession.endPercentage;
        const totalMinutes = estimatedMinutes;

        const totalTicks = totalMinutes / TIME_SCALE;
        const pctPerTick = (endPct - startPct) / totalTicks;

        let current = startPct;
        let remaining = totalMinutes;

        setCurrentPercentage(current);
        setRemainingMinutes(remaining);

        const interval = setInterval(() => {
            current += pctPerTick;
            remaining -= TIME_SCALE;

            if (remaining <= 0 || current >= endPct) {
                setCurrentPercentage(endPct);
                setRemainingMinutes(0);
                clearInterval(interval);
                return;
            }

            setCurrentPercentage(Math.round(current));
            setRemainingMinutes(Math.round(remaining));
        }, TICK_MS);

        return () => clearInterval(interval);
    }, [activeSession, estimatedMinutes]);

    // Estimate charging
    const estimate = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post("/charging/estimate", {
                vehicleId,
                stationId,
                startPercentage: start,
                endPercentage: end
            });

            setPreview(res.data);
            setEstimatedMinutes(res.data.totalTimeMinutes);
        } catch (e) {
            setError(e.response?.data?.message || "Could not estimate charging");
        }
    };

    // Start charging
    const startCharging = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/charging/start", {
                vehicleId,
                stationId,
                startPercentage: start,
                targetPercentage: end
            });

            setActiveSession(res.data);
            setPreview(null);
        } catch (e) {
            setError(e.response?.data?.message || "Could not start charging");
        } finally {
            setLoading(false);
        }
    };

    // Stop charging
    const stopCharging = async () => {
        setLoading(true);
        setError(null);

        try {
            await api.post("/charging/stop", {
                sessionId: activeSession.id,
                endPercentage: currentPercentage ?? end
            });

            setActiveSession(null);
            setCurrentPercentage(null);
            setRemainingMinutes(null);
            setEstimatedMinutes(null);
        } catch (e) {
            setError(e.response?.data?.message || "Could not stop charging");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Charge my vehicle</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!activeSession && (
                <form onSubmit={estimate}>
                    <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} required>
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.brand} {v.model}
                            </option>
                        ))}
                    </select>

                    <select value={stationId} onChange={e => setStationId(e.target.value)} required>
                        <option value="">Select station</option>
                        {stations.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.location}
                            </option>
                        ))}
                    </select>

                    <input type="number" min="0" max="100" value={start} onChange={e => setStart(+e.target.value)} />
                    <input type="number" min="1" max="100" value={end} onChange={e => setEnd(+e.target.value)} />

                    <button disabled={loading}>Estimate charging</button>
                </form>
            )}

            {preview && !activeSession && (
                <div style={{ marginTop: "12px" }}>
                    <p>Queue: {preview.queueTimeMinutes} min</p>
                    <p>Charging: {preview.chargingTimeMinutes} min</p>
                    <strong>Total: {preview.totalTimeMinutes} min</strong>
                    <br />
                    <button onClick={startCharging} disabled={loading}>
                        🔌 Start charging
                    </button>
                </div>
            )}

            {activeSession && (
                <div style={{ marginTop: "12px" }}>
                    <p>🔋 Charging in progress</p>

                    <progress
                        value={Number(currentPercentage ?? activeSession.startPercentage)}
                        max={activeSession.endPercentage}
                        style={{ width: "100%" }}
                    />

                    <p>
                        {currentPercentage ?? activeSession.startPercentage}% → {activeSession.endPercentage}%
                    </p>

                    <p>⏱️ Time remaining: {remainingMinutes ?? "calculating…"} min</p>

                    <button onClick={stopCharging} disabled={loading}>
                        ⛔ Stop charging
                    </button>
                </div>
            )}
        </div>
    );
}
