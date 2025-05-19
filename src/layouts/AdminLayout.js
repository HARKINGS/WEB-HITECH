import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import "../styles/AdminLayout.css";
import adminAvatar from "../assets/images/admin.png";

// Helper function to decode JWT token
const decodeJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [username, setUsername] = useState("Admin User");
    const location = useLocation();

    useEffect(() => {
        // Get token from cookie
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.sub) {
                setUsername(decodedToken.sub);
            }
        }
    }, []);

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <a href="/" className="logo-link">
                        <h2>{sidebarCollapsed ? "ET" : "Electech"}</h2>
                    </a>
                    <button className="toggle-sidebar" onClick={toggleSidebar}>
                        ☰
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className={isActive("/admin")}>
                            <Link to="/admin">
                                <FaTachometerAlt />
                                {!sidebarCollapsed && <span>Dashboard</span>}
                            </Link>
                        </li>
                        <li className={isActive("/admin/products")}>
                            <Link to="/admin/products">
                                <FaBoxOpen />
                                {!sidebarCollapsed && <span>Products</span>}
                            </Link>
                        </li>
                        <li className={isActive("/admin/orders")}>
                            <Link to="/admin/orders">
                                <FaShoppingCart />
                                {!sidebarCollapsed && <span>Orders</span>}
                            </Link>
                        </li>
                        <li className={isActive("/admin/users")}>
                            <Link to="/admin/users">
                                <FaUsers />
                                {!sidebarCollapsed && <span>Users</span>}
                            </Link>
                        </li>
                        <li className={isActive("/admin/vouchers")}>
                            <Link to="/admin/vouchers">
                                <FaTicketAlt />
                                {!sidebarCollapsed && <span>Vouchers</span>}
                            </Link>
                        </li>
                        <li className={isActive("/admin/settings")}>
                            <Link to="/admin/settings">
                                <FaCog />
                                {!sidebarCollapsed && <span>Settings</span>}
                            </Link>
                        </li>
                        <li className="logout">
                            <Link to="/logout">
                                <FaSignOutAlt />
                                {!sidebarCollapsed && <span>Exit Admin</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <div className="admin-header">
                    <div className="admin-header-search">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="admin-header-actions">
                        <ThemeToggle />
                        <div className="admin-user">
                            <img src={adminAvatar} alt="Admin" />
                            <span>{username}</span>
                        </div>
                    </div>
                </div>
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
