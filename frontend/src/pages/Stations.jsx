import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../Styles/Stations.css";

export default function Stations() {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/stations").then(res => setStations(res.data));
    }, []);

    const getStatus = (station) => {
        if (station.currentQueue === 0) return "free";
        if (station.estimatedWaitTime < 15) return "medium";
        return "busy";
    };

    return (
        <div className="stations-page">
            <h2>Stations</h2>

            <div className="station-grid">
                {stations.map(s => (
                    <div
                        key={s.id}
                        className={`station-card ${getStatus(s)}`}
                    >
                        <div className="station-card-inner">
                            {/* HEADER */}
                            <div className="station-header">
                                <h3>{s.location}</h3>
                                <span className="status-dot" />
                            </div>

                            {/* META */}
                            <div className="station-meta">
                                <div>🔌 {s.totalPlugs} plugs</div>
                                <div>⚡ {s.avgChargeSeed} kW</div>
                                <div>👥 Queue: {s.currentQueue}</div>
                                <div>⏱️ Wait: {s.estimatedWaitTime} min</div>
                                <div>💰 {s.pricePerKWh} kr/kWh</div>
                            </div>

                            {/* ACTION */}
                            <button
                                className="station-action"
                                onClick={() =>
                                    navigate("/dashboard", {
                                        state: { stationId: s.id }
                                    })
                                }
                                title="Charge here"
                            >
                                🔌 Charge here
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

