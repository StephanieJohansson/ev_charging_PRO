import { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';


// Login component for user authentication
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send login request to backend API
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role } = response.data;
            login(token, role);
            navigate('/stations');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    // Render login form
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button>Login</button>
        </form>
    );
    <p>
        No account yet? <a href="/register">Register here</a>
    </p>
}


