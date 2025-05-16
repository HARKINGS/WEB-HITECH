import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import "../styles/AdminLayout.css";

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

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
                    <h2>{sidebarCollapsed ? "ET" : "Electech"}</h2>
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
                            <Link to="/">
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
                        <div className="admin-user">
                            <img src="https://via.placeholder.com/40" alt="Admin" />
                            <span>Admin User</span>
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
