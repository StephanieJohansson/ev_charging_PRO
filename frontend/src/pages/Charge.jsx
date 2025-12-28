import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // form state
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // fetch vehicles
    const loadVehicles = () => {
        setLoading(true);
        api
            .get("/vehicles")
            .then(res => {
                setVehicles(res.data);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load vehicles");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    // add vehicle
    const handleAddVehicle = e => {
        e.preventDefault();

        if (!brand || !model || !plateNumber) {
            alert("All fields are required");
            return;
        }

        setSubmitting(true);

        api
            .post("/vehicles", {
                brand,
                model,
                plateNumber
            })
            .then(() => {
                setBrand("");
                setModel("");
                setPlateNumber("");
                loadVehicles();
            })
            .catch(err => {
                console.error(err);
                alert("Could not add vehicle");
            })
            .finally(() => setSubmitting(false));
    };

    // delete vehicle
    const handleDeleteVehicle = id => {
        if (!window.confirm("Delete this vehicle?")) return;

        api
            .delete(`/vehicles/${id}`)
            .then(() => {
                setVehicles(prev => prev.filter(v => v.id !== id));
            })
            .catch(err => {
                console.error(err);
                alert("Could not delete vehicle");
            });
    };

    if (loading) return <p>Loading vehicles...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2>My Vehicles</h2>

            {vehicles.length === 0 ? (
                <p>No vehicles added yet.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {vehicles.map(v => (
                        <li
                            key={v.id}
                            style={{
                                border: "1px solid #444",
                                padding: "12px",
                                marginBottom: "10px",
                                borderRadius: "6px"
                            }}
                        >
                            <strong>
                                {v.brand} {v.model}
                            </strong>
                            <br />
                            Plate: {v.plateNumber}
                            <br />
                            Battery: {v.batteryCapacity} kWh
                            <br />
                            <button
                                onClick={() => handleDeleteVehicle(v.id)}
                                style={{ marginTop: "8px" }}
                            >
                                🗑 Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <hr style={{ margin: "30px 0" }} />

            <h3>Add vehicle</h3>

            <form onSubmit={handleAddVehicle}>
                <div>
                    <input
                        placeholder="Brand"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder="Model"
                        value={model}
                        onChange={e => setModel(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder="Plate number"
                        value={plateNumber}
                        onChange={e => setPlateNumber(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add vehicle"}
                </button>
            </form>
        </div>
    );
}
