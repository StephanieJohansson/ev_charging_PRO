import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/stations" replace />;
    }

    return children;
}
