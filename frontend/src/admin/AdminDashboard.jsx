import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();

    return (
        <div className="dashboard-grid">

            <div className="dashboard-left">

                <section className="card">
                    <h2>Admin Control Panel</h2>

                    <div className="admin-cards">

                        <div className="admin-card">
                            <h3>Manage Stations</h3>
                            <p>Create, edit or delete charging stations</p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/admin/stations")}
                            >
                                Open
                            </button>
                        </div>

                        <div className="admin-card">
                            <h3>Run Simulation</h3>
                            <p>Test station parameters before launching</p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/admin/sim")}
                            >
                                Start Simulation
                            </button>
                        </div>

                        <div className="admin-card">
                            <h3>Create Station</h3>
                            <p>Add a new station directly to the network</p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/admin/create")}
                            >
                                Create
                            </button>
                        </div>

                        <div className="admin-card">
                            <h3>Manage Users</h3>
                            <p>View and manage registered users</p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/admin/users")}
                            >
                                Open
                            </button>
                        </div>

                    </div>
                </section>

            </div>

        </div>
    );
}