import { useEffect, useState } from "react";
import api from "../api/api";
import ChargeForm from "../components/ChargeForm";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [history, setHistory] = useState([]);

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [plateNumber, setPlateNumber] = useState("");

    const location = useLocation();
    const preselectedStationId = location.state?.stationId;

    /* ---------------- LOAD DATA ---------------- */

    const loadVehicles = () => {
        api.get("/vehicles").then(res => setVehicles(res.data));
    };

    const loadHistory = () => {
        api.get("/charging/history")
            .then(res => setHistory(res.data))
            .catch(() => {});
    };

    useEffect(() => {
        loadVehicles();
        loadHistory();
    }, []);

    /* ---------------- VEHICLE ACTIONS ---------------- */

    const handleAddVehicle = e => {
        e.preventDefault();

        api.post("/vehicles", { brand, model, plateNumber }).then(() => {
            setBrand("");
            setModel("");
            setPlateNumber("");
            loadVehicles();
        });
    };

    const handleDeleteVehicle = id => {
        if (!window.confirm("Delete vehicle?")) return;
        api.delete(`/vehicles/${id}`).then(loadVehicles);
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="dashboard-grid">

            {/* LEFT COLUMN */}
            <div className="dashboard-left">

                {/* VEHICLES */}
                <section className="card">
                    <h2>My Vehicles</h2>

                    {vehicles.length === 0 ? (
                        <p className="muted">No vehicles added yet.</p>
                    ) : (
                        <ul className="vehicle-list">
                            {vehicles.map(v => (
                                <li key={v.id} className="vehicle-item">
                                    <strong>{v.brand} {v.model}</strong>
                                    <p className="muted">Plate: {v.plateNumber}</p>
                                    <p className="muted">Battery: {v.batteryCapacity} kWh</p>

                                    <button
                                        className="btn danger-btn"
                                        onClick={() => handleDeleteVehicle(v.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* ADD VEHICLE */}
                <section className="card">
                    <h2>Add vehicle</h2>

                    <form className="form" onSubmit={handleAddVehicle}>
                        <input
                            placeholder="Brand"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        />
                        <input
                            placeholder="Model"
                            value={model}
                            onChange={e => setModel(e.target.value)}
                        />
                        <input
                            placeholder="Plate number"
                            value={plateNumber}
                            onChange={e => setPlateNumber(e.target.value)}
                        />

                        <button className="btn">Add vehicle</button>
                    </form>
                </section>

                {/* CHARGING */}
                <section className="card">
                    <h2>Charge my vehicle</h2>

                    {preselectedStationId && (
                        <p className="muted">
                            📍 Station selected from stations list
                        </p>
                    )}
                    <ChargeForm
                        vehicles={vehicles}
                        preselectedStationId={preselectedStationId}
                        onSessionFinished={loadHistory}
                    />

                </section>

            </div>

            {/* RIGHT COLUMN */}
            <aside className="dashboard-right">
                <section className="card history-card">
                    <h2>Charging history</h2>

                    {history.length === 0 ? (
                        <p className="muted">No completed sessions yet.</p>
                    ) : (
                        <>
                            <button
                                className="btn"
                                onClick={async () => {
                                    await api.delete("/charging/history");
                                    setHistory([]);
                                }}
                            >
                                🧹 Clear history
                            </button>

                            <ul className="history-list">
                                {history.map(h => (
                                    <li key={h.id} className="history-item">
                                        <strong>
                                            {h.vehicle.brand} {h.vehicle.model}
                                        </strong>

                                        <p>🔋 {h.startPercentage}% → {h.endPercentage}%</p>
                                        <p>⚡ {h.energyKWh.toFixed(2)} kWh</p>
                                        <p>💰 {h.totalCost.toFixed(2)} kr</p>

                                        <p className="muted">
                                            🕒 {new Date(h.startTime).toLocaleString()} –{" "}
                                            {new Date(h.endTime).toLocaleString()}
                                        </p>

                                        <p className="muted">
                                            Duration: {h.durationMinutes} min
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            </aside>

        </div>
    );
}
