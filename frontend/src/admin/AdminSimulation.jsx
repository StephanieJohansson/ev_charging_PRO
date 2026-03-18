import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminSimulation() {

    const navigate = useNavigate();

    const [stationName, setStationName] = useState("");
    const [connectors, setConnectors] = useState("");
    const [powerKw, setPowerKw] = useState("");
    const [pricePerKWh, setPricePerKWh] = useState("");

    const [hourOfDay, setHourOfDay] = useState("");
    const [trafficLevel, setTrafficLevel] = useState("LOW");
    const [temperature, setTemperature] = useState("");
    const [baseServiceMinutes, setBaseServiceMinutes] = useState("");

    const [result, setResult] = useState(null);

    const runSimulation = async () => {

        console.log("Running simulation...");

        const request = {
            hourOfDay: parseInt(hourOfDay),
            trafficLevel: trafficLevel,
            temperature: parseFloat(temperature),
            baseServiceMinutes: parseFloat(baseServiceMinutes),
            stationPowerKw: parseFloat(powerKw),
            connectors: parseInt(connectors)
        };

        try {

            const response = await api.post("/admin/sim", request);

            console.log("Simulation response:", response.data);

            setResult(response.data);

        } catch (error) {
            console.error("Simulation failed:", error);
        }
    };

    const deleteSimulation = () => {
        setResult(null);
    };

    const promoteStation = async () => {

        const station = {
            location: stationName,
            totalPlugs: parseInt(connectors),
            avgChargeSeed: parseFloat(powerKw),
            pricePerKWh: parseFloat(pricePerKWh)
        };

        try {

            await api.post("/stations", station);

            alert("Station created successfully");

            setResult(null);

            navigate("/stations", { state: { created: true } });

        } catch (error) {
            console.error("Create station failed:", error);
        }
    };

    const format = (value) => {
        if (value === undefined || value === null) return "-";
        return Number(value).toFixed(2);
    };

    return (
        <div className="admin-page">
            <button
                className="btn admin-back"
                onClick={() => navigate("/admin")}
            >
                ← Back to admin control panel
            </button>

        <div className="dashboard-grid">
            <div className="dashboard-left">

                <section className="card">

                    <h2>Station Simulation</h2>

                    <input
                        placeholder="Station name"
                        value={stationName}
                        onChange={(e) => setStationName(e.target.value)}
                    />

                    <input
                        placeholder="Connectors"
                        value={connectors}
                        onChange={(e) => setConnectors(e.target.value)}
                    />

                    <input
                        placeholder="Power (kW)"
                        value={powerKw}
                        onChange={(e) => setPowerKw(e.target.value)}
                    />

                    <input
                        placeholder="Price per KWh"
                        value={pricePerKWh}
                        onChange={(e) => setPricePerKWh(e.target.value)}
                    />

                    <input
                        placeholder="Hour of day (0-23)"
                        value={hourOfDay}
                        onChange={(e) => setHourOfDay(e.target.value)}
                    />

                    <select
                        value={trafficLevel}
                        onChange={(e) => setTrafficLevel(e.target.value)}
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    <input
                        placeholder="Temperature"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                    />

                    <input
                        placeholder="Base service minutes"
                        value={baseServiceMinutes}
                        onChange={(e) => setBaseServiceMinutes(e.target.value)}
                    />

                    <button
                        className="btn"
                        onClick={runSimulation}
                    >
                        Run simulation
                    </button>

                    {result && (
                        <div className="card">

                            <h3>Simulation Result</h3>

                            <p>
                                Expected queue length: {format(result.Lq)} cars
                            </p>

                            <p>
                                Average waiting time: {format(result.Wq)} minutes
                            </p>

                            <p>
                                Total time in system: {format(result.W)} minutes
                            </p>

                            <p>
                                Station utilization: {result.rho ? (result.rho * 100).toFixed(1) : "-"}%
                            </p>

                            {result.rho >= 1 && (
                                <p style={{color:"orange"}}>
                                    ⚠ Station overloaded — add more connectors
                                </p>
                            )}

                            <div style={{marginTop:"12px"}}>

                                <button
                                    className="btn"
                                    onClick={deleteSimulation}>
                                    Delete simulation
                                </button>

                                <button
                                    className="btn"
                                    onClick={promoteStation}
                                    style={{marginLeft:"10px"}}
                                >
                                    Promote to station
                                </button>

                            </div>

                        </div>
                    )}

                </section>

            </div>
        </div>
        </div>
    );
}