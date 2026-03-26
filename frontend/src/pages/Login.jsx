import { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../Styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', { email, password });
            console.log("LOGIN RESPONSE: ", response.data);

            const { token, role } = response.data;
            login(token, role);

            if (role.includes('ADMIN')) {
                navigate("/admin");
            } else {
                navigate("/stations");
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>

                <p style={{ textAlign: "center", marginTop: "10px", color: "#ccc" }}>
                    No account yet?{" "}
                    <a href="/register" style={{ color: "#2ecc71" }}>
                        Register here
                    </a>
                </p>
            </form>
        </div>
    );
}