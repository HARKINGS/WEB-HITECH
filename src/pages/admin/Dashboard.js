import React from 'react';
import { FaBoxOpen, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import '../../styles/AdminPages.css';

const Dashboard = () => {
    // Mock data
    const stats = [
        { id: 1, title: 'Total Products', value: '247', icon: <FaBoxOpen />, color: '#0d6efd' },
        { id: 2, title: 'Total Orders', value: '52', icon: <FaShoppingCart />, color: '#dc3545' },
        { id: 3, title: 'Total Users', value: '129', icon: <FaUsers />, color: '#198754' },
        { id: 4, title: 'Revenue', value: '$12,456', icon: <FaDollarSign />, color: '#ffc107' },
    ];

    const recentOrders = [
        { id: '#1234', customer: 'John Doe', date: '2023-06-20', status: 'Completed', amount: '$129.99' },
        { id: '#1235', customer: 'Jane Smith', date: '2023-06-19', status: 'Processing', amount: '$79.99' },
        { id: '#1236', customer: 'Bob Johnson', date: '2023-06-18', status: 'Pending', amount: '$249.99' },
        { id: '#1237', customer: 'Alice Brown', date: '2023-06-17', status: 'Completed', amount: '$59.99' },
        { id: '#1238', customer: 'Charlie Wilson', date: '2023-06-16', status: 'Cancelled', amount: '$189.99' },
    ];

    return (
        <div className="admin-page dashboard">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                {stats.map(stat => (
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
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
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
