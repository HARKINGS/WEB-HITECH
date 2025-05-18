import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Logout = () => {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        // Execute logout function from AuthContext
        logout();
    }, [logout]);

    // Redirect to home page after logout
    return <Navigate to="/" replace />;
};

export default Logout;
