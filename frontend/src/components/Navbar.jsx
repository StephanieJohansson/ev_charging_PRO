import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../Styles/Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-left">
                <NavLink to="/stations" className="nav-item">Stations</NavLink>

                {user && <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>}

                {user?.role === "ADMIN" && (
                    <>
                        <NavLink to="/admin/users" className="nav-item">All users</NavLink>
                        <NavLink to="/admin/sim" className="nav-item">Simulation</NavLink>
                        <NavLink to="/admin" className="nav-item">Admin dashboard</NavLink>
                    </>
                )}
            </div>

            <div className="nav-right">
                {!user ? (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                ) : (
                    <button onClick={logout}>Logout</button>
                )}
            </div>
        </nav>
    );
}
