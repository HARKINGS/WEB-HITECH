import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import "../../styles/AdminPages.css";
import RoleModal from "../../components/modals/RoleModal";

const Settings = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/roles`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.code.toString() === "1000") {
                setRoles(response.data.result);
            } else {
                throw new Error("Failed to fetch roles");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching roles:", err);
            setError("Failed to load roles. Please try again later.");
            setLoading(false);
        }
    };

    const handleRoleClick = (role) => {
        setSelectedRole(role);
    };

    const handleEditRole = (role) => {
        // Disabled as feature is under construction
        return;
    };

    const handleCreateRole = () => {
        setEditingRole(null);
        setShowRoleModal(true);
    };

    const handleRoleModalSuccess = async (formData) => {
        try {
            if (editingRole) {
                // Handle edit
                const response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/roles/${editingRole.name}`,
                    formData
                );
                if (response.data.success) {
                    const updatedRoles = roles.map((role) =>
                        role._id === editingRole._id ? response.data.result : role
                    );
                    setRoles(updatedRoles);
                }
            } else {
                // Handle create
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}`, formData);
                if (response.data.success) {
                    setRoles([...roles, response.data.result]);
                }
            }
        } catch (error) {
            console.error("Error saving role:", error);
            throw error;
        }
    };

    const handleDeleteRole = async (role) => {
        if (role.name === "ADMIN") {
            // Show error or alert that ADMIN role cannot be deleted
            alert("ADMIN role cannot be deleted");
            return;
        }

        try {
            const response = await axios.delete(`/api/roles/${role.name}`);
            if (response.data.code.toString() === "1000") {
                // Remove the role from the state
                setRoles(roles.filter((r) => r._id !== role._id));
                if (selectedRole && selectedRole._id === role._id) {
                    setSelectedRole(null);
                }
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            alert("Failed to delete role. Please try again later.");
        }
    };

    if (loading)
        return (
            <Container fluid className="admin-content p-4">
                <div className="text-center">Loading roles...</div>
            </Container>
        );

    if (error)
        return (
            <Container fluid className="admin-content p-4">
                <div className="text-center text-danger">{error}</div>
            </Container>
        );

    return (
        <Container fluid className="admin-content p-4">
            <Row>
                <Col md={4} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h4 mb-0 text-light">Quản lý Role</h2>
                        <Button variant="outline-light" size="sm" onClick={handleCreateRole}>
                            <FaPlus className="me-1" /> Tạo Role mới
                        </Button>
                    </div>
                    <ListGroup variant="dark">
                        {roles.map((role) => (
                            <ListGroup.Item
                                key={role.name}
                                className={`d-flex justify-content-between align-items-center bg-dark text-light border-secondary ${
                                    selectedRole?.name === role.name ? "active" : ""
                                }`}
                                onClick={() => handleRoleClick(role)}
                                style={{
                                    cursor: "pointer",
                                    "--bs-list-group-active-bg": "var(--background-secondary)",
                                    "--bs-list-group-active-border-color": "var(--border-color)",
                                }}
                            >
                                <div>
                                    <div className="fw-bold text-light">{role.name}</div>
                                    <small className="text-secondary">{role.description}</small>
                                </div>
                                <div>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Role editing is currently under construction</Tooltip>}
                                    >
                                        <span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-light me-2"
                                                title="Edit role"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditRole(role);
                                                }}
                                                disabled
                                                style={{ pointerEvents: "none", opacity: 0.5 }}
                                            >
                                                <FaEdit />
                                            </Button>
                                        </span>
                                    </OverlayTrigger>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-danger"
                                        title="Delete role"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRole(role);
                                        }}
                                        disabled={role.name === "ADMIN"}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={8}>
                    {selectedRole ? (
                        <div>
                            <h3 className="h4 mb-3 text-light">Chi tiết Role: {selectedRole.name}</h3>
                            <p className="text-secondary">{selectedRole.description}</p>
                            <h4 className="h5 mb-3 text-light">Permissions:</h4>
                            <ListGroup variant="dark">
                                {selectedRole.permissions.map((permission) => (
                                    <ListGroup.Item
                                        key={permission.name}
                                        className="bg-dark text-light border-secondary"
                                    >
                                        <div className="fw-bold text-light">{permission.name}</div>
                                        <small className="text-secondary">{permission.description}</small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    ) : (
                        <div className="text-center text-secondary">
                            <p>Vui lòng chọn một role để xem chi tiết</p>
                        </div>
                    )}
                </Col>
            </Row>

            <RoleModal
                isOpen={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                role={editingRole}
                onSuccess={handleRoleModalSuccess}
            />
        </Container>
    );
};

export default Settings;
