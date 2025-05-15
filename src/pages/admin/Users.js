import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { Table, Button, Container, Form, Row, Col, Badge, Pagination } from "react-bootstrap";
import UserModal from "../../components/modals/UserModal";
import { PERMISSIONS } from "../../constants/permissions";
import "bootstrap/dist/css/bootstrap.min.css";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
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
                    role: user.roles?.[0]?.name || "STAFF",
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
                const roleType = "STAFF"; // Set default role type for new users
                response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/${roleType}`, apiData, {
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

    // Filter users based on search term and selected role
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            searchTerm.trim() === "" ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === "" || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    // Update pagination calculation to use filtered users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole]);

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
        return (
            <Container className="py-4 bg-dark text-light">
                <div>Loading users...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4 bg-dark">
                <div className="text-danger">Error: {error}</div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 bg-dark text-light">
            {/* User creation/edit modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={currentUser}
                onSuccess={handleUserSuccess}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-light">Users</h1>
                {permissions.canCreate && (
                    <Button variant="primary" onClick={handleAddUser}>
                        <FaUserPlus className="me-2" /> Add New User
                    </Button>
                )}
            </div>

            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                    <Form.Group>
                        <Form.Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-dark text-light border-secondary"
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Table responsive hover variant="dark" className="border-secondary align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
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
                            <td>
                                <span
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${
                                        user.role === "ADMIN"
                                            ? "bg-primary-subtle text-primary-emphasis"
                                            : "bg-secondary-subtle text-secondary-emphasis"
                                    }`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td>{user.joined}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    {permissions.canUpdate && (
                                        <Button variant="outline-info" size="sm" onClick={() => handleEditUser(user)}>
                                            <FaEdit />
                                        </Button>
                                    )}
                                    {permissions.canDelete && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4">
                <Pagination className="pagination-dark">
                    <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1} className="text-light" />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageChange(number)}
                            className={number === currentPage ? "active" : "text-light"}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="text-light"
                    />
                </Pagination>
            </div>
        </Container>
    );
};

export default Users;
