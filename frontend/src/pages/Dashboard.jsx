import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/vehicles")
            .then(res => {
                setVehicles(res.data);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load vehicles");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading vehicles...</p>;
    if (error) return <p>Error loading vehicles. Please try again later.</p>;

    return (
        <div>
            <h2>My Vehicles</h2>

            {vehicles.length === 0 ? (
                <p>No vehicles found. Please add a vehicle to your account.</p>
            ) : (
                <ul>
                    {vehicles.map(v => (
                        <li key={v.id}>
                            <strong>{v.brand} {v.model}</strong><br />
                            Plate: {v.plateNumber}<br />
                            Battery: {v.batteryCapacity} kWh
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
