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
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            if (editingRole) {
                // Handle edit
                const response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/roles/${editingRole.name}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.success) {
                    await fetchRoles(); // Reload roles after successful update
                }
            } else {
                // Handle create
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/roles`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    await fetchRoles(); // Reload roles after successful creation
                }
            }
            setShowRoleModal(false); // Close modal after success
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

        if (!window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            return;
        }

        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/roles/${role.name}`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.code.toString() === "1000") {
                await fetchRoles(); // Reload roles after successful deletion
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
            <Container fluid className="p-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
                <div className="text-center">Loading roles...</div>
            </Container>
        );

    if (error)
        return (
            <Container fluid className="p-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
                <div className="text-center" style={{ color: "var(--price-color)" }}>{error}</div>
            </Container>
        );

    return (
        <Container fluid className="p-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
            <Row>
                <Col md={4} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h4 mb-0">Quản lý Role</h2>
                        <Button variant="outline-primary" size="sm" onClick={handleCreateRole}>
                            <FaPlus className="me-1" /> Tạo Role mới
                        </Button>
                    </div>
                    <ListGroup>
                        {roles.map((role) => (
                            <ListGroup.Item
                                key={role.name}
                                className={`d-flex justify-content-between align-items-center ${
                                    selectedRole?.name === role.name ? "active" : ""
                                }`}
                                onClick={() => handleRoleClick(role)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "var(--background-secondary)",
                                    color: "var(--text-primary)",
                                    border: "1px solid var(--border-color)",
                                    ...(selectedRole?.name === role.name && {
                                        backgroundColor: "var(--accent-color)",
                                        color: "var(--text-on-accent)",
                                        borderColor: "var(--accent-color)"
                                    })
                                }}
                            >
                                <div>
                                    <div className="fw-bold">{role.name}</div>
                                    <small style={{ color: selectedRole?.name === role.name ? "var(--text-on-accent)" : "var(--text-secondary)" }}>
                                        {role.description}
                                    </small>
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
                                                style={{ color: "var(--text-primary)" }}
                                                className="me-2"
                                                title="Edit role"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditRole(role);
                                                }}
                                                disabled
                                            >
                                                <FaEdit />
                                            </Button>
                                        </span>
                                    </OverlayTrigger>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        style={{ color: "var(--price-color)" }}
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
                            <h3 className="h4 mb-3">Chi tiết Role: {selectedRole.name}</h3>
                            <p style={{ color: "var(--text-secondary)" }}>{selectedRole.description}</p>
                            <h4 className="h5 mb-3">Permissions:</h4>
                            <ListGroup>
                                {selectedRole.permissions.map((permission) => (
                                    <ListGroup.Item
                                        key={permission.name}
                                        style={{
                                            backgroundColor: "var(--background-secondary)",
                                            color: "var(--text-primary)",
                                            border: "1px solid var(--border-color)"
                                        }}
                                    >
                                        <div className="fw-bold">{permission.name}</div>
                                        <small style={{ color: "var(--text-secondary)" }}>{permission.description}</small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    ) : (
                        <div className="text-center" style={{ color: "var(--text-secondary)" }}>
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
