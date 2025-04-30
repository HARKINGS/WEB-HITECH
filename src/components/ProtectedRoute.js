import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Show loading state
    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    // If not authenticated, redirect to login with return path
    if (!isAuthenticated) {
        // For demo purposes - remove in production
        const isDemo = window.location.search.includes('demo=true');
        if (isDemo) {
            return <Outlet />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render the protected route
    return <Outlet />;
};

export default ProtectedRoute;
