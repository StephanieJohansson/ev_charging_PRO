import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import "../Styles/Admin.css";

export default function AdminStations() {

    const navigate = useNavigate();

    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editStation, setEditStation] = useState(null);
    const [editData, setEditData] = useState({});

    // calculate wait time based on queue
    const calculateWaitTime = (station) => {
        if (!station.currentQueue) return 0;
        return station.currentQueue * 10;
    };

    const loadStations = () => {
        setLoading(true);
        api
            .get("/stations")
            .then(res => {
                console.log(res.data);
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

    const handleUpdate = async () => {
        try {
            await api.put(`/admin/stations/${editStation}`, editData);

            setEditStation(null);
            setEditData({});
            loadStations();

        } catch (err) {
            console.error(err);
            alert("Could not update station");
        }
    };

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
        <div className="admin-page">

            <button
                className="btn admin-back"
                onClick={() => navigate("/admin")}
            >
                ← Back to admin control panel
            </button>

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

                                {/* LOCATION */}

                                <strong>
                                    {editStation === station.id ? (
                                        <input
                                            value={editData.location || ""}
                                            onChange={(e) =>
                                                setEditData({ ...editData, location: e.target.value })
                                            }
                                        />
                                    ) : (
                                        station.location
                                    )}
                                </strong>

                                <br />

                                {/* POWER */}

                                Power: {editStation === station.id ? (
                                <input
                                    type="number"
                                    value={editData.avgChargeSeed || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, avgChargeSeed: e.target.value })
                                    }
                                />
                            ) : (
                                station.avgChargeSeed
                            )} kW

                                <br />

                                {/* PLUGS */}

                                Plugs: {editStation === station.id ? (
                                <input
                                    type="number"
                                    value={editData.totalPlugs || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, totalPlugs: e.target.value })
                                    }
                                />
                            ) : (
                                station.totalPlugs
                            )}

                                <br />

                                {/* QUEUE */}

                                Queue: {station.currentQueue}

                                <br />

                                {/* ESTIMATED WAIT */}

                                Estimated wait: {calculateWaitTime(station)} min

                                <br />

                                {/* BUTTONS */}

                                <div style={{ marginTop: "10px" }}>

                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setEditStation(station.id);
                                            setEditData(station);
                                        }}
                                    >
                                        ✏ Edit
                                    </button>

                                    <button
                                        className="btn"
                                        onClick={() => handleDelete(station.id)}
                                    >
                                        🗑 Delete
                                    </button>

                                    {editStation === station.id && (
                                        <>
                                            <button
                                                className="btn"
                                                onClick={handleUpdate}
                                            >
                                                💾 Save
                                            </button>

                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    setEditStation(null);
                                                    setEditData({});
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                </div>

                            </li>

                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}