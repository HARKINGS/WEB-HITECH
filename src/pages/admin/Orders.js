import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import '../../styles/AdminPages.css';

const Orders = () => {
    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // Number of orders to display per page

    // Mock data
    const orders = [
        { id: '#1234', customer: 'John Doe', date: '2023-06-20', status: 'Completed', items: 3, total: '$129.99' },
        { id: '#1235', customer: 'Jane Smith', date: '2023-06-19', status: 'Processing', items: 2, total: '$79.99' },
        { id: '#1236', customer: 'Bob Johnson', date: '2023-06-18', status: 'Pending', items: 5, total: '$249.99' },
        { id: '#1237', customer: 'Alice Brown', date: '2023-06-17', status: 'Completed', items: 1, total: '$59.99' },
        { id: '#1238', customer: 'Charlie Wilson', date: '2023-06-16', status: 'Cancelled', items: 4, total: '$189.99' },
        { id: '#1239', customer: 'Eva Green', date: '2023-06-15', status: 'Completed', items: 2, total: '$99.99' },
        { id: '#1240', customer: 'David Miller', date: '2023-06-14', status: 'Processing', items: 3, total: '$149.99' },
        { id: '#1241', customer: 'Grace Lee', date: '2023-06-13', status: 'Pending', items: 1, total: '$29.99' },
    ];

    // Calculate pagination values
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="admin-page orders">
            <div className="page-header">
                <h1>Orders</h1>
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <input type="text" placeholder="Search orders..." className="filter-input" />
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="filter-group">
                    <input type="date" className="filter-input" />
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{order.items}</td>
                                <td>{order.total}</td>
                                <td className="actions">
                                    <button className="btn-icon edit"><FaEye /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="btn-page"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </button>

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        className={`btn-page ${currentPage === number ? 'active' : ''}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                <button
                    className="btn-page"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Orders;
