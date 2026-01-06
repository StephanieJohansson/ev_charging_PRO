import { useEffect, useState } from "react";
import api from "../api/api";

const TICK_MS = 1000;
const TIME_SCALE = 1;

export default function ChargeForm({ vehicles, onSessionFinished, preselectedStationId }) {
    const [stations, setStations] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [stationId, setStationId] = useState(preselectedStationId ??"");
    const [start, setStart] = useState(20);
    const [end, setEnd] = useState(80);

    const [preview, setPreview] = useState(null);
    const [activeSession, setActiveSession] = useState(null);
    const [estimatedMinutes, setEstimatedMinutes] = useState(null);

    const [currentPercentage, setCurrentPercentage] = useState(null);
    const [remainingMinutes, setRemainingMinutes] = useState(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showComplete, setShowComplete] = useState(false);

    const isComplete =
        currentPercentage !== null &&
        activeSession &&
        currentPercentage >= activeSession.endPercentage;

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        if (preselectedStationId) {
            setStationId(preselectedStationId);
        }
    }, [preselectedStationId]);

    useEffect(() => {
        api.get("/stations").then(res => setStations(res.data));

        api.get("/charging/active")
            .then(res => setActiveSession(res.data))
            .catch(() => {});
    }, []);

    /* ---- If active session but no estimate (refresh) ---- */
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

    /* ---------------- LIVE SIMULATION ---------------- */

    useEffect(() => {
        if (!activeSession || !estimatedMinutes) return;

        const startPct = activeSession.startPercentage;
        const endPct = activeSession.endPercentage;

        let elapsed = 0;

        const interval = setInterval(async () => {
            elapsed += TIME_SCALE;

            const ratio = Math.min(elapsed / estimatedMinutes, 1);
            const current =
                startPct + (endPct - startPct) * ratio;

            setCurrentPercentage(Math.round(current));
            setRemainingMinutes(
                Math.max(0, Math.round(estimatedMinutes - elapsed))
            );

            if (ratio >= 1) {
                clearInterval(interval);
                setShowComplete(true);

                await api.post("/charging/stop", {
                    sessionId: activeSession.id,
                    endPercentage: endPct
                });

                setTimeout(() => {
                    setShowComplete(false);
                    setActiveSession(null);
                    setEstimatedMinutes(null);
                    setCurrentPercentage(null);
                    setRemainingMinutes(null);

                    onSessionFinished?.(); // 🔁 dashboard reload
                }, 2000);
            }
        }, TICK_MS);

        return () => clearInterval(interval);
    }, [activeSession, estimatedMinutes]);

    /* ---------------- ACTIONS ---------------- */

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
        } catch {
            setError("Could not estimate charging");
        }
    };

    const startCharging = async () => {
        setLoading(true);
        setError(null);

        const res = await api.post("/charging/start", {
            vehicleId,
            stationId,
            startPercentage: start,
            targetPercentage: end
        });

        setActiveSession(res.data);
        setPreview(null);
        setLoading(false);
    };

    const stopCharging = async () => {
        setLoading(true);

        await api.post("/charging/stop", {
            sessionId: activeSession.id,
            endPercentage: currentPercentage ?? end
        });

        setActiveSession(null);
        setEstimatedMinutes(null);
        setCurrentPercentage(null);
        setRemainingMinutes(null);
        setLoading(false);

        onSessionFinished?.();
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="card">
            <h3>Charge my vehicle</h3>
            {error && <p className="error">{error}</p>}

            {!activeSession && (
                <form onSubmit={estimate} className="form">
                    <select required value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.brand} {v.model}
                            </option>
                        ))}
                    </select>

                    <select required value={stationId} onChange={e => setStationId(e.target.value)}>
                        <option value="">Select station</option>
                        {stations.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.location}
                            </option>
                        ))}
                    </select>

                    <div className="row">
                        <input type="number" value={start} onChange={e => setStart(+e.target.value)} />
                        <input type="number" value={end} onChange={e => setEnd(+e.target.value)} />
                    </div>

                    <button className="btn">Estimate charging</button>
                </form>
            )}

            {preview && !activeSession && (
                <>
                    <p>Queue: {preview.queueTimeMinutes} min</p>
                    <p>Charging: {preview.chargingTimeMinutes} min</p>
                    <strong>Total: {preview.totalTimeMinutes} min</strong>
                    <p>⚡ {preview.estimatedEnergyKWh.toFixed(2)} kWh</p>
                    <p>💰 {preview.estimatedCost.toFixed(2)} kr</p>

                    <button className="btn" onClick={startCharging}>
                        🔌 Start charging
                    </button>
                </>
            )}

            {activeSession && !showComplete && (
                <>
                    <progress
                        value={currentPercentage ?? activeSession.startPercentage}
                        max={activeSession.endPercentage}
                    />

                    <p>{currentPercentage ?? activeSession.startPercentage}% → {activeSession.endPercentage}%</p>
                    <p>⏱ {remainingMinutes} min left</p>

                    <button className="btn danger" onClick={stopCharging}>
                        Stop charging
                    </button>
                </>
            )}

            {showComplete && (
                <p className="success">✅ Charging complete</p>
            )}
        </div>
    );
}
