import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Helper function to decode JWT token
    const decodeJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    // Load user from cookie on initial render
    useEffect(() => {
        const loadUserFromCookie = async () => {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const decodedToken = decodeJwt(token);
                if (!decodedToken) throw new Error("Invalid token");

                // Get user data from decoded token
                const userData = {
                    id: decodedToken.jti,
                    username: decodedToken.sub,
                    role: decodedToken.scope.includes("ROLE_ADMIN") ? "ADMIN" : "STAFF",
                    permissions: decodedToken.scope.split(" "),
                };

                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(true);
            } catch (error) {
                console.error("Error validating token:", error);
                // Clear invalid cookie
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        loadUserFromCookie();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.code === 1000) {
                const token = data.result.token;
                // Set cookie with token - expires in 1 hour
                document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

                const decodedToken = decodeJwt(token);
                const userData = {
                    id: decodedToken.jti,
                    username: decodedToken.sub,
                    role: decodedToken.scope.includes("ROLE_ADMIN") ? "ADMIN" : "STAFF",
                    permissions: decodedToken.scope.split(" "),
                };

                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.role === "ADMIN");
                return true;
            } else {
                throw new Error(data.message || "Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw new Error("Failed to login. Please try again.");
        }
    };

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
