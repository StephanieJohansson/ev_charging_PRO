import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../Styles/Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">

            {/* NAV LEFT – visas bara för icke-admin */}
            {user?.role !== "ADMIN" && (
                <div className="nav-left">

                    <NavLink to="/stations" className="nav-item">
                        Stations
                    </NavLink>

                    {user && (
                        <NavLink to="/dashboard" className="nav-item">
                            Dashboard
                        </NavLink>
                    )}

                </div>
            )}

            {/* NAV RIGHT */}
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