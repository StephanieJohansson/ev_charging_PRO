import { useState } from "react";
import api from "../api/api.js";
import "../Styles/Admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminCreateStation() {

    const navigate = useNavigate();

    const [location, setLocation] = useState("");
    const [avgChargeSeed, setAvgChargeSeed] = useState("");
    const [totalPlugs, setTotalPlugs] = useState("");
    const [currentQueue, setCurrentQueue] = useState("");
    const [estimatedWaitTime, setEstimatedWaitTime] = useState("");
    const [pricePerKWh, setPricePerKWh] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        if (!location || !avgChargeSeed || !totalPlugs) {
            alert("Location, power and plugs are required");
            return;
        }

        setSubmitting(true);

        api.post("/admin/stations", {
            location,
            avgChargeSeed: Number(avgChargeSeed),
            totalPlugs: Number(totalPlugs),
            currentQueue: Number(currentQueue) || 0,
            estimatedWaitTime: Number(estimatedWaitTime) || 0,
            pricePerKWh: Number(pricePerKWh) || 0
        })
            .then(() => {
                alert("Station created successfully");
                navigate("/admin/stations");

                setLocation("");
                setAvgChargeSeed("");
                setTotalPlugs("");
                setCurrentQueue("");
                setEstimatedWaitTime("");
                setPricePerKWh("");
            })
            .catch(err => {
                console.error(err);
                alert("Could not create station");
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="admin-page">

            <button
                className="btn admin-back"
                onClick={() => navigate("/admin")}
            >
                ← Back to admin control panel
            </button>

            <div className="admin-form-container">

                <section className="card">
                    <h2>Admin – Create Station</h2>

                    <form className="form" onSubmit={handleSubmit}>

                        <input
                            placeholder="Location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Avg charge speed (kW)"
                            value={avgChargeSeed}
                            onChange={e => setAvgChargeSeed(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Total plugs"
                            value={totalPlugs}
                            onChange={e => setTotalPlugs(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Current queue"
                            value={currentQueue}
                            onChange={e => setCurrentQueue(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Estimated wait time (min)"
                            value={estimatedWaitTime}
                            onChange={e => setEstimatedWaitTime(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Price per kWh"
                            value={pricePerKWh}
                            onChange={e => setPricePerKWh(e.target.value)}
                        />

                        <button
                            className="btn"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Creating..." : "Create station"}
                        </button>

                    </form>

                </section>

            </div>
        </div>
    );
}