import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Stations from "./pages/Stations";
import Dashboard from "./pages/Dashboard";
import AdminStations from "./admin/AdminStations.jsx";
import AdminCreateStation from "./admin/AdminCreateStation.jsx";

import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar.jsx";

import AdminRoute from "./auth/AdminRoute";

import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminSimulation from "./admin/AdminSimulation.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";

import "./index.css";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Stations />} />
                    <Route path="/stations" element={<Stations />} />

                    {/* User protected */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin protected */}
                    <Route
                        path="/admin"
                        element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                        }
                        />

                    <Route
                        path="/admin/stations"
                        element={
                            <AdminRoute>
                                <AdminStations />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/sim"
                        element={
                        <AdminRoute>
                            <AdminSimulation />
                        </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                        }
                       />

                    <Route
                        path="/admin/create"
                        element={
                            <AdminRoute>
                                <AdminCreateStation />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
