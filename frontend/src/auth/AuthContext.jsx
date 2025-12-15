import { createContext, useState } from 'react'

export const AuthContext = createContext();

// AuthProvider component to wrap the application and provide auth state
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('Token');
        const role = localStorage.getItem('Role');
        return token ? { token, role } : null;
    });

    // Function to handle login
    const login = (token, role) => {
        localStorage.setItem('Token', token);
        localStorage.setItem('Role', role);
        setUser({ token, role });
    };

    // Function to handle logout
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    // Provide user state and auth functions to children components
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}