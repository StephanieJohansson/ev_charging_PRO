import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminUsers() {

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
        <div className="dashboard-grid">

            <div className="dashboard-left">

                <section className="card">
                    <h2>All Users</h2>

                    <table>

                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                        </tbody>

                    </table>

                </section>

            </div>

        </div>
    );
}