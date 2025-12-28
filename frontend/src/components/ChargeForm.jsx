// src/components/ChargeForm.jsx
import { useEffect, useState } from "react";
import api from "../api/api";

export default function ChargeForm({ vehicles }) {
    const [stations, setStations] = useState([]);
    const [vehicleId, setVehicleId] = useState("");
    const [stationId, setStationId] = useState("");
    const [start, setStart] = useState(20);
    const [end, setEnd] = useState(80);
    const [result, setResult] = useState(null);
    const [previewResult, setPreviewResult] = useState(null);
    const [chargingStarted, setChargingStarted] = useState(false);


    useEffect(() => {
        api.get("/stations").then(res => setStations(res.data));
    }, []);

    const estimate = e => {
        e.preventDefault();
        api
            .post("/charging/estimate", {
                vehicleId,
                stationId,
                startPercentage: start,
                endPercentage: end
            })
            .then(res => setPreviewResult(res.data));
    };

    const startCharging = () => {
        api.post("/charging/start", {
            vehicleId,
            stationId,
            startPercentage: start,
            endPercentage: end
        })
            .then(() => {
                setChargingStarted(true);
            })
            .catch(err => {
                console.error(err);
                alert("Could not start charging");
            });
    };

    return (
        <div>
            <h3>Charge my vehicle</h3>

            <form onSubmit={estimate}>
                <select value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                    <option value="">Select vehicle</option>
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                            {v.brand} {v.model}
                        </option>
                    ))}
                </select>

                <select value={stationId} onChange={e => setStationId(e.target.value)}>
                    <option value="">Select station</option>
                    {stations.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.location}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    value={start}
                    onChange={e => setStart(e.target.value)}
                />

                <input
                    type="number"
                    value={end}
                    onChange={e => setEnd(e.target.value)}
                />

                <button>Estimate charging</button>
            </form>

            {previewResult && (
                <div style={{ marginTop: "12px" }}>
                    <p>Queue time: {previewResult.queueMinutes} min</p>
                    <p>Charging time: {previewResult.chargingMinutes} min</p>
                    <p>
                        <strong>
                            Total: {previewResult.totalMinutes} min
                        </strong>
                    </p>

                    {!chargingStarted && (
                        <button
                            style={{ marginTop: "12px" }}
                            type="button"
                            onClick={startCharging}
                        >
                            🔌 Start charging
                        </button>
                    )}

                    {chargingStarted && (
                        <p style={{ marginTop: "12px" }}>
                            ✅ Charging started
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}