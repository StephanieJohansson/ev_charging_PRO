import { useEffect, useState } from 'react'
import api from '../api/api';

// Dashboard component to display user-specific information
export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch user's vehicles from backend API on component mount
     useEffect(() => {
     api.get('/vehicles')
         .then(res => setVehicles(res.data))
         .catch(() => alert('Could not load vehicles'))
         .finally(() => setLoading(false));
     }, []);

     if (loading) {
         return <p>Loading vehicles...</p>;
     }

     return (
            <div>
                <h2>My Vehicles</h2>

                {vehicles.length === 0 && (
                    <p>No vehicles found. Please add a vehicle to your account.</p>
                )}

            <ul>
                {vehicles.map(vehicle => (
                    <li key={v.id}>
                        <b>{v.brand} {v.model}</b>
                    <br />
                     Plate: {v.plateNumber}
                     <br />
                     Battery: {v.batterSizeKWh}  kWh
                    </li>
                    ))}
            </ul>
        </div>
    );
}