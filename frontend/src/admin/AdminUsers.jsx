import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../Styles/Admin.css";

export default function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
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
                    <h2>All Users</h2>

                    <table>

                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Vehicle</th>
                            <th>Role</th>
                        </tr>
                        </thead>

                        <tbody>

                        {users.map((user) => (
                            <tr key={user.id}>

                                <td>{user.username}</td>

                                <td>{user.email}</td>

                                <td>
                                    {user.vehicles && user.vehicles.length > 0 ? (
                                        user.vehicles.map(v => (
                                            <span className="vehicle-badge" key={v.id}>
                                                {v.brand} {v.model}
                                            </span>
                                        ))
                                    ) : (
                                        "No vehicles"
                                    )}
                                </td>

                                <td>{user.role}</td>

                            </tr>
                        ))}
                        </tbody>

                    </table>

                </section>

            </div>

        </div>
        </div>
    );
}