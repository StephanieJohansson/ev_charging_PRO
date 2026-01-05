import { useEffect, useState } from "react";
import api from "../api/api";

const TICK_MS = 1000;      // 1 second
const TIME_SCALE = 1;     // 1 second = 1 minute

export default function ChargeForm({ vehicles }) {
    const [stations, setStations] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [stationId, setStationId] = useState("");
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


    const [history, setHistory] = useState( [])

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        api.get("/stations").then(res => setStations(res.data));

        api.get("/charging/active")
            .then(res => setActiveSession(res.data))
            .catch(() => {});
    }, []);

    /* ---------------- LOAD CHARGING HISTORY ---------------- */

    useEffect(() => {
        api.get("/charging/history")
            .then(res => setHistory(res.data))
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

            // ⭐ AUTO STOP
            if (ratio >= 1) {
                clearInterval(interval);

                // Visa "Charging complete"
                setShowComplete(true);

                await api.post("/charging/stop", {
                    sessionId: activeSession.id,
                    endPercentage: endPct
                });

                // refresh history
                const historyRes = await api.get("/charging/history");
                setHistory(historyRes.data);

                // let user see the message for a bit before clearing it
                setTimeout(() => {
                    setShowComplete(false);
                    setActiveSession(null);
                    setEstimatedMinutes(null);
                    setCurrentPercentage(null);
                    setRemainingMinutes(null);
                }, 2000);
            }
        }, TICK_MS);

        return () => clearInterval(interval);
    }, [activeSession, estimatedMinutes]);


    /* ---------------- ACTIONS ---------------- */

    const estimate = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await api.post("/charging/estimate", {
            vehicleId,
            stationId,
            startPercentage: start,
            endPercentage: end
        });

        setPreview(res.data);
        setEstimatedMinutes(res.data.totalTimeMinutes);
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
        api.get("/charging/history")
            .then(res => setHistory(res.data));


        setActiveSession(null);
        setEstimatedMinutes(null);
        setCurrentPercentage(null);
        setRemainingMinutes(null);
        setLoading(false);
    };

    /* ---------------- UI ---------------- */

    return (
        <div>
            <h3>Charge my vehicle</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!activeSession && (
                <form onSubmit={estimate}>
                    <select required value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                        ))}
                    </select>

                    <select required value={stationId} onChange={e => setStationId(e.target.value)}>
                        <option value="">Select station</option>
                        {stations.map(s => (
                            <option key={s.id} value={s.id}>{s.location}</option>
                        ))}
                    </select>

                    <input type="number" value={start} onChange={e => setStart(+e.target.value)} />
                    <input type="number" value={end} onChange={e => setEnd(+e.target.value)} />

                    <button>Estimate charging</button>
                </form>
            )}

            {preview && !activeSession && (
                <>
                    <p>Queue: {preview.queueTimeMinutes} min</p>
                    <p>Charging: {preview.chargingTimeMinutes} min</p>
                    <strong>Total: {preview.totalTimeMinutes} min</strong>
                    <br />
                    <button onClick={startCharging}>🔌 Start charging</button>
                </>
            )}

            {/* 🔋 ACTIVE CHARGING */}
            {activeSession && !showComplete && (
                <>
                    <p>🔋 Charging in progress</p>

                    <progress
                        value={currentPercentage ?? activeSession.startPercentage}
                        max={activeSession.endPercentage}
                        style={{ width: "100%" }}
                    />

                    <p>
                        {currentPercentage ?? activeSession.startPercentage}% →{" "}
                        {activeSession.endPercentage}%
                    </p>

                    <p>⏱️ Time remaining: {remainingMinutes} min</p>

                    <button onClick={stopCharging}>⛔ Stop charging</button>
                </>
            )}

            {/* ✅ CHARGING COMPLETE */}
            {showComplete && activeSession && (
                <>
                    <p style={{ color: "#4caf50", fontWeight: "bold" }}>
                        ✅ Charging complete
                    </p>
                    <p>{activeSession.endPercentage}% reached</p>
                </>
            )}


            {history.length > 0 && (
                <>
                    <h3>Charging history</h3>
                    <button
                    onClick={async () => {
                        await api.delete("/charging/history");
                        setHistory([]);
                    }}
                >
                    🧹 Clear history
                </button>
                    <ul>
                        {history.map(session => (
                            <li key={session.id} style={{ marginBottom: "12px" }}>
                                <strong>
                                    {session.vehicle.brand} {session.vehicle.model}
                                </strong>
                                <br />

                                🔋 {session.startPercentage}% → {session.endPercentage}%
                                <br />

                                ⚡ {session.energyKWh.toFixed(2)} kWh
                                <br />

                                💰 {session.totalCost.toFixed(2)} kr
                                <br />

                                🕒 {new Date(session.startTime).toLocaleString()} –{" "}
                                {new Date(session.endTime).toLocaleString()}
                                <br />

                                ⏱️ {session.durationMinutes} min
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </div>
    );
}
