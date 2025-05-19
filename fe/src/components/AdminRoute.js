import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    if (!isAuthenticated || !isAdmin) {
        // Create the redirect URL with the current path
        const redirectUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirectUrl}`} />;
    }

    return <Outlet />;
};

export default AdminRoute;
