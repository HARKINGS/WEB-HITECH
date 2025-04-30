import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on initial render
    useEffect(() => {
        const loadUserFromStorage = () => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    setIsAdmin(parsedUser.role === 'admin');
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    // If there's an error, clear storage
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                }
            }
            setLoading(false);
        };

        loadUserFromStorage();
    }, []);

    // Login function - in real app, this would make API call
    const login = async (credentials) => {
        try {
            // Simulate API call
            // In production, replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // For demo purposes
            if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
                const userData = {
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@example.com',
                    role: 'admin'
                };
                const token = 'demo-token-123';

                // Store in localStorage
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_data', JSON.stringify(userData));

                // Update state
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.role === 'admin');
                return true;
            }

            // For admin login
            if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
                const userData = {
                    id: 2,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin'
                };
                const token = 'admin-token-123';

                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_data', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(true);
                return true;
            }

            throw new Error('Invalid email or password');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            // In a real app, we would send the data to an API
            // For demo, we'll just create a user object
            const newUser = {
                id: Math.floor(Math.random() * 1000),
                name: userData.name,
                email: userData.email,
                role: 'customer'
            };

            const token = `token-${Date.now()}`;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_data', JSON.stringify(newUser));

            setUser(newUser);
            setIsAuthenticated(true);
            setIsAdmin(false);

            return true;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');

        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
