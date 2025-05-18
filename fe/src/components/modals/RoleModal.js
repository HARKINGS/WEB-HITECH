import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { PERMISSIONS } from "../../constants/permissions";

const RoleModal = ({ isOpen, onClose, role = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: [],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // If role is provided, this is an edit operation
    const isEditMode = !!role;
    const isAdminRole = role?.name === "ADMIN";

    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || "",
                description: role.description || "",
                permissions: Array.isArray(role.permissions) ? role.permissions.map((p) => p.name || p) : [],
            });
        } else {
            setFormData({
                name: "",
                description: "",
                permissions: [],
            });
        }
        setErrors({});
        setSubmitError("");
    }, [role, isOpen]);

    // Group permissions by category
    const permissionGroups = {
        Product: Object.entries(PERMISSIONS).filter(([key]) => key.includes("GOODS")),
        User: Object.entries(PERMISSIONS).filter(([key]) => key.includes("USER")),
        Role: Object.entries(PERMISSIONS).filter(([key]) => key.includes("ROLE")),
        Permission: Object.entries(PERMISSIONS).filter(([key]) => key.includes("PERMISSION") && !key.includes("ROLE")),
        Voucher: Object.entries(PERMISSIONS).filter(([key]) => key.includes("VOUCHER")),
    };

    const handlePermissionChange = (permission) => {
        if (isAdminRole) return; // Prevent changes to ADMIN role permissions
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Role name is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Role description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAdminRole) {
            setSubmitError("The ADMIN role cannot be modified");
            return;
        }

        setSubmitError("");
        if (validate()) {
            setIsSubmitting(true);
            try {
                await onSuccess(formData);
                onClose();
            } catch (error) {
                setSubmitError(
                    error.message === "Role already exists"
                        ? "Role name already exists. Please choose another."
                        : "Failed to save role. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" className="text-light">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{isEditMode ? "Edit Role" : "Add New Role"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Role Name*</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter role name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            isInvalid={!!errors.name}
                            disabled={isAdminRole}
                            className="bg-dark text-light border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Description*</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter role description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            isInvalid={!!errors.description}
                            disabled={isAdminRole}
                            className="bg-dark text-light border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="mt-4">
                        <h5 className="mb-3 text-light">Permissions</h5>
                        {isAdminRole && (
                            <div className="alert alert-info" role="alert">
                                The ADMIN role has all permissions and cannot be modified.
                            </div>
                        )}
                        <Row>
                            {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                                <Col md={6} key={groupName} className="mb-4">
                                    <div className="card bg-dark border-secondary">
                                        <div className="card-header bg-dark border-secondary">
                                            <h6 className="mb-0 text-light">{groupName} Permissions</h6>
                                        </div>
                                        <div className="card-body">
                                            {permissions.map(([key, value]) => {
                                                const isChecked = isAdminRole || formData.permissions.includes(value);
                                                return (
                                                    <Form.Check
                                                        key={key}
                                                        type="checkbox"
                                                        id={`permission-${key}`}
                                                        label={key.split("_").join(" ").toLowerCase()}
                                                        checked={isChecked}
                                                        onChange={() => handlePermissionChange(value)}
                                                        disabled={isAdminRole}
                                                        className="mb-2 text-light"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || isAdminRole}>
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Role" : "Create Role"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RoleModal;
