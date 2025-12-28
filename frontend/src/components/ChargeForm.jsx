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
            .then(res => setResult(res.data));
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

            {result && (
                <div>
                    <p>Queue time: {result.queueTimeMinutes} min</p>
                    <p>Charging time: {result.chargingTimeMinutes} min</p>
                    <p>Total: {result.totalTimeMinutes} min</p>
                </div>
            )}
        </div>
    );
}
