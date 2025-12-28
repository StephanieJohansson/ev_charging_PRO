import { useState } from "react";
import api from "../api/api";

export default function AdminCreateStation() {
    const [location, setLocation] = useState("");
    const [avgChargeSpeed, setAvgChargeSpeed] = useState("");
    const [totalPlugs, setTotalPlugs] = useState("");
    const [currentQueue, setCurrentQueue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        if (!location || !avgChargeSpeed || !totalPlugs) {
            alert("Location, power and plugs are required");
            return;
        }

        setSubmitting(true);

        api
            .post("/admin/stations", {
                location,
                avgChargeSpeed: Number(avgChargeSpeed),
                totalPlugs: Number(totalPlugs),
                currentQueue: Number(currentQueue) || 0
            })
            .then(() => {
                alert("Station created");
                setLocation("");
                setAvgChargeSpeed("");
                setTotalPlugs("");
                setCurrentQueue("");
            })
            .catch(err => {
                console.error(err);
                alert("Could not create station");
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h2>Admin – Create Station</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        placeholder="Location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Avg charge speed (kW)"
                        value={avgChargeSpeed}
                        onChange={e => setAvgChargeSpeed(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Total plugs"
                        value={totalPlugs}
                        onChange={e => setTotalPlugs(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Current queue (optional)"
                        value={currentQueue}
                        onChange={e => setCurrentQueue(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create station"}
                </button>
            </form>
        </div>
    );
}
