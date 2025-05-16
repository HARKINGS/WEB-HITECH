import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaShoppingCart, FaUsers, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { PERMISSIONS } from "../../constants/permissions";
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
                canViewUsers: hasPermission(token, PERMISSIONS.GET_ALL_USERS),
                canViewProducts: hasPermission(token, PERMISSIONS.GET_ALL_GOODS),
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
                        if (usersResponse.data.code.toString() === "1000") {
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
        <Container fluid className="py-4 bg-dark text-light">
            <h1 className="mb-4">Dashboard</h1>

            <Row className="g-4 mb-4">
                {stats.map((stat) => (
                    <Col key={stat.id} xs={12} sm={6} xl={3}>
                        <Card bg="dark" text="light" className="h-100 border-secondary">
                            <Card.Body className="d-flex align-items-center">
                                <div
                                    className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        backgroundColor: stat.color,
                                        width: "48px",
                                        height: "48px",
                                        flexShrink: 0,
                                    }}
                                >
                                    <div style={{ fontSize: "1.25rem" }}>{stat.icon}</div>
                                </div>
                                <div>
                                    <Card.Title className="mb-1 fs-6">{stat.title}</Card.Title>
                                    <Card.Text className="fs-4 fw-bold mb-0">{stat.value}</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col>
                    <Card bg="dark" text="light" className="border-secondary">
                        <Card.Header className="border-secondary">
                            <h5 className="mb-0">Recent Orders</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover variant="dark" className="mb-0">
                                <thead className="border-secondary">
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
                                                <span
                                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${
                                                        order.status === "Completed"
                                                            ? "bg-success-subtle text-success-emphasis"
                                                            : order.status === "Processing"
                                                            ? "bg-primary-subtle text-primary-emphasis"
                                                            : order.status === "Pending"
                                                            ? "bg-warning-subtle text-warning-emphasis"
                                                            : "bg-danger-subtle text-danger-emphasis"
                                                    }`}
                                                    style={{ fontSize: "0.85rem" }}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{order.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
