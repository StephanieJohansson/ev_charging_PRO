import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminStations() {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStations = () => {
        setLoading(true);
        api
            .get("/stations")
            .then(res => {
                setStations(res.data);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load stations");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadStations();
    }, []);

    const handleDelete = id => {
        if (!window.confirm("Delete this station?")) return;

        api
            .delete(`/stations/${id}`)
            .then(() => {
                setStations(prev => prev.filter(s => s.id !== id));
            })
            .catch(err => {
                console.error(err);
                alert("Could not delete station");
            });
    };

    if (loading) return <p>Loading stations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2>Admin – Stations</h2>

            {stations.length === 0 ? (
                <p>No stations found.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {stations.map(station => (
                        <li
                            key={station.id}
                            style={{
                                border: "1px solid #444",
                                padding: "14px",
                                marginBottom: "12px",
                                borderRadius: "6px"
                            }}
                        >
                            <strong>{station.location}</strong>
                            <br />
                            Power: {station.avgChargeSpeed} kW
                            <br />
                            Plugs: {station.totalPlugs}
                            <br />
                            Queue: {station.currentQueue}
                            <br />
                            Estimated wait: {station.estimatedWaitTime} min
                            <br />

                            <button
                                style={{ marginTop: "10px" }}
                                onClick={() => handleDelete(station.id)}
                            >
                                🗑 Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
