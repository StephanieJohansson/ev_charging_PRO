import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// ProtectedRoute component to restrict access based on authentication
export default function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}