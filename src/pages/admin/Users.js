import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/AdminPages.css';

const Users = () => {
    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // Number of users to display per page

    // Mock data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joined: '2023-03-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active', joined: '2023-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Customer', status: 'Inactive', joined: '2023-04-10' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Customer', status: 'Active', joined: '2023-01-25' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Manager', status: 'Active', joined: '2023-05-05' },
        { id: 6, name: 'Eva Green', email: 'eva@example.com', role: 'Customer', status: 'Active', joined: '2023-04-18' },
        { id: 7, name: 'David Miller', email: 'david@example.com', role: 'Customer', status: 'Inactive', joined: '2023-03-30' },
        { id: 8, name: 'Grace Lee', email: 'grace@example.com', role: 'Customer', status: 'Active', joined: '2023-05-12' },
        { id: 9, name: 'Frank Thomas', email: 'frank@example.com', role: 'Customer', status: 'Active', joined: '2023-06-01' },
        { id: 10, name: 'Helen Martinez', email: 'helen@example.com', role: 'Customer', status: 'Active', joined: '2023-06-10' },
        { id: 11, name: 'Ivan Roberts', email: 'ivan@example.com', role: 'Manager', status: 'Active', joined: '2023-06-15' },
    ];

    // Calculate pagination values
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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
        <div className="admin-page users">
            <div className="page-header">
                <h1>Users</h1>
                <button className="btn btn-primary">
                    <FaUserPlus /> Add New User
                </button>
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <input type="text" placeholder="Search users..." className="filter-input" />
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.joined}</td>
                                <td className="actions">
                                    <button className="btn-icon edit"><FaEdit /></button>
                                    <button className="btn-icon delete"><FaTrash /></button>
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

export default Users;
