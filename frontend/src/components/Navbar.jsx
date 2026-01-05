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
                        <NavLink to="/admin/stations" className="nav-item">Admin stations</NavLink>
                        <NavLink to="/admin/create" className="nav-item">Create station</NavLink>
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
