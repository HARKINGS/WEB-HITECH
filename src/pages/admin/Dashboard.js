import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaShoppingCart, FaUsers, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import "../../styles/AdminPages.css";

// Helper function to decode JWT token
const decodeJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

// Helper function to check if user has required permission
const hasPermission = (token, requiredPermission) => {
    const decodedToken = decodeJwt(token);
    if (!decodedToken || !decodedToken.scope) return false;
    return decodedToken.scope.split(" ").includes(requiredPermission);
};

const Dashboard = () => {
    const [stats, setStats] = useState([
        { id: 1, title: "Total Products", value: "...", icon: <FaBoxOpen />, color: "#0d6efd" },
        { id: 2, title: "Total Orders", value: "...", icon: <FaShoppingCart />, color: "#dc3545" },
        { id: 3, title: "Total Users", value: "...", icon: <FaUsers />, color: "#198754" },
        { id: 4, title: "Revenue", value: "...", icon: <FaDollarSign />, color: "#ffc107" },
    ]);

    const [permissions, setPermissions] = useState({
        canViewUsers: false,
        canViewProducts: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check permissions on component mount
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            setPermissions({
                canViewUsers: hasPermission(token, "GET_ALL_USERS"),
                canViewProducts: hasPermission(token, "GET_ALL_GOODS"),
            });
        }
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch products count if permitted
                if (permissions.canViewProducts) {
                    try {
                        const productsResponse = await axios.get(
                            `${process.env.REACT_APP_API_BASE_URL}/goods/all-goods`,
                            config
                        );
                        if (productsResponse.data.code.toString() === "1000") {
                            const productsCount = productsResponse.data.result.length;
                            setStats((currentStats) => {
                                const newStats = [...currentStats];
                                newStats[0] = { ...newStats[0], value: productsCount.toString() };
                                return newStats;
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching products:", error);
                    }
                }

                // Fetch users count if permitted
                if (permissions.canViewUsers) {
                    try {
                        const usersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`, config);
                        if (usersResponse.data.code === "1000") {
                            const usersCount = usersResponse.data.result.length;
                            setStats((currentStats) => {
                                const newStats = [...currentStats];
                                newStats[2] = { ...newStats[2], value: usersCount.toString() };
                                return newStats;
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching users:", error);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data");
                setLoading(false);
            }
        };

        if (permissions.canViewUsers || permissions.canViewProducts) {
            fetchDashboardData();
        }
    }, [permissions]);

    // Mock data for orders (since API is not available yet)
    const recentOrders = [
        { id: "#1234", customer: "John Doe", date: "2023-06-20", status: "Completed", amount: "$129.99" },
        { id: "#1235", customer: "Jane Smith", date: "2023-06-19", status: "Processing", amount: "$79.99" },
        { id: "#1236", customer: "Bob Johnson", date: "2023-06-18", status: "Pending", amount: "$249.99" },
        { id: "#1237", customer: "Alice Brown", date: "2023-06-17", status: "Completed", amount: "$59.99" },
        { id: "#1238", customer: "Charlie Wilson", date: "2023-06-16", status: "Cancelled", amount: "$189.99" },
    ];

    if (loading) {
        return <div className="admin-page dashboard">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="admin-page dashboard">Error: {error}</div>;
    }

    return (
        <div className="admin-page dashboard">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="stat-card" key={stat.id}>
                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-row">
                <div className="dashboard-col">
                    <div className="panel">
                        <h2>Recent Orders</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
