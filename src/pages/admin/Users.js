import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import UserModal from "../../components/modals/UserModal";
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

const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [permissions, setPermissions] = useState({
        canCreate: false,
        canView: false,
        canUpdate: false,
        canDelete: false,
    });
    const usersPerPage = 5;

    // Check permissions on component mount
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            setPermissions({
                canCreate: hasPermission(token, PERMISSIONS.CREATE_USER),
                canView: hasPermission(token, PERMISSIONS.GET_ALL_USERS),
                canUpdate: hasPermission(token, PERMISSIONS.UPDATE_USER),
                canDelete: hasPermission(token, PERMISSIONS.DELETE_USER),
            });
        }
    }, []);

    // Fetch users from API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.code.toString() === "1000") {
                const mappedUsers = response.data.result.map((user) => ({
                    id: user.userId,
                    name: `${user.firstName} ${user.lastName}`.trim() || user.username,
                    username: user.username,
                    email: user.username,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    birthDate: user.dob || "",
                    role: user.roles?.[0]?.name || "User",
                    status: "Active",
                    joined: user.dob || new Date().toISOString().split("T")[0],
                    // Get permissions from the first role's scope
                    permissions: user.roles?.[0]?.permissions?.map((perm) => perm.name) || [],
                }));
                setUsers(mappedUsers);
            } else {
                throw new Error("Failed to fetch users");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again later.");
            setLoading(false);
        }
    };

    // Handle adding a new user
    const handleAddUser = () => {
        setCurrentUser(null); // Ensure we're in create mode, not edit mode
        setIsModalOpen(true);
    };

    // Handle editing a user
    const handleEditUser = (user) => {
        const userToEdit = {
            ...user,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ").slice(1).join(" ") || "",
            permissions: user.permissions || [], // Use permissions directly from user object
            birthDate: user.joined, // Using joined date as birth date since we're using it that way
        };
        setCurrentUser(userToEdit);
        setIsModalOpen(true);
    };

    // Handle user modal success
    const handleUserSuccess = async (userData) => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Format the data according to API requirements
            const apiData = {
                username: userData.username,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                birthDate: userData.birthDate || "2000-01-01",
            };

            let response;

            if (!currentUser) {
                // Create new user
                apiData.password = userData.password;
                const roleType = "staff"; // Set default role type for new users
                response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/${roleType}`, apiData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Update existing user
                response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/users/${currentUser.id}`,
                    {
                        ...apiData,
                        permissions: userData.permissions,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            if (response.data.code.toString() === "1000") {
                if (currentUser) {
                    // Update user in the list
                    setUsers(
                        users.map((user) =>
                            user.id === currentUser.id
                                ? {
                                      ...user,
                                      name: `${apiData.firstName} ${apiData.lastName}`.trim() || apiData.username,
                                      username: apiData.username,
                                      email: apiData.username,
                                      permissions: userData.permissions,
                                  }
                                : user
                        )
                    );
                } else {
                    // Add new user to the list
                    const newUser = {
                        id: response.data.userId,
                        name: `${apiData.firstName} ${apiData.lastName}`.trim() || apiData.username,
                        username: apiData.username,
                        email: apiData.username,
                        role: "Staff",
                        status: "Active",
                        joined: new Date().toISOString().split("T")[0],
                    };
                    setUsers([...users, newUser]);
                }
                setIsModalOpen(false);
            } else {
                throw new Error(response.data.message || "Failed to save user");
            }
        } catch (err) {
            console.error("Error saving user:", err);
            throw err;
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.code.toString() === "1000") {
                    // Remove user from local state
                    setUsers(users.filter((user) => user.id !== userId));
                } else {
                    throw new Error("Failed to delete user");
                }
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

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
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div className="admin-page users">Loading users...</div>;
    }

    if (error) {
        return <div className="admin-page users">Error: {error}</div>;
    }

    return (
        <div className="admin-page users">
            {/* User creation/edit modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                onSuccess={handleUserSuccess}
            />

            <div className="page-header">
                <h1>Users</h1>
                {permissions.canCreate && (
                    <button className="btn btn-primary" onClick={handleAddUser}>
                        <FaUserPlus /> Add New User
                    </button>
                )}
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <input type="text" placeholder="Search users..." className="filter-input" />
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
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
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
                                </td>
                                <td>{user.joined}</td>
                                <td className="actions">
                                    {permissions.canUpdate && (
                                        <button className="btn-icon edit" onClick={() => handleEditUser(user)}>
                                            <FaEdit />
                                        </button>
                                    )}
                                    {permissions.canDelete && (
                                        <button className="btn-icon delete" onClick={() => handleDeleteUser(user.id)}>
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="btn-page" onClick={handlePrevious} disabled={currentPage === 1}>
                    &laquo;
                </button>

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`btn-page ${currentPage === number ? "active" : ""}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                <button className="btn-page" onClick={handleNext} disabled={currentPage === totalPages}>
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Users;
