import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/stations">Stations</Link>

                {user.role === "ADMIN" && (
                    <>
                        <Link to="/admin/stations">Admin: Stations</Link>
                        <Link to="/admin/create">Admin: Create station</Link>
                    </>
                )}
            </div>

            <button onClick={logout}>Logout</button>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #444",
        marginBottom: "20px"
    },
    left: {
        display: "flex",
        gap: "15px"
    }
};
