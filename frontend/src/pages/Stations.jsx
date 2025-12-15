import { useEffect, useState } from "react";
import api from "../api/api";

// Stations component to display list of stations
export default function Stations() {
    const [stations, setStations] = useState([]);

    // Fetch stations from backend API on component mount
 useEffect(() => {
 api.get('/stations').then(res => setStations(res.data));
}, []);

    // Render list of stations
    return (
        <div>
            <h2>Stations</h2>
            {stations.map(s => (
                <div key={s.id}>
                    <b>{s.location}</b> – Queue: {s.currentQueue}, Wait: {s.estimatedWaitTime} min
                </div>
            ))}
        </div>
    );
}