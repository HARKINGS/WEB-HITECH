import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Modal, Form, Button, Row, Col, Container } from "react-bootstrap";
import { PERMISSIONS } from "../../constants/permissions";


const UserModal = ({ isOpen, onClose, user = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        permissions: [],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // If user is provided, this is an edit operation
    const isEditMode = !!user;

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                password: "",
                confirmPassword: "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                birthDate: user.birthDate || "",
                permissions: Array.isArray(user.permissions) ? user.permissions : [],
            });
        } else {
            setFormData({
                username: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                birthDate: "",
                permissions: [],
            });
        }
        setErrors({});
        setSubmitError("");
    }, [user, isOpen]);

    // Group permissions by category
    const permissionGroups = {
        Product: Object.entries(PERMISSIONS).filter(([key]) => key.includes("GOODS")),
        User: Object.entries(PERMISSIONS).filter(([key]) => key.includes("USER")),
        Role: Object.entries(PERMISSIONS).filter(([key]) => key.includes("ROLE")),
        Permission: Object.entries(PERMISSIONS).filter(([key]) => key.includes("PERMISSION") && !key.includes("ROLE")),
        Voucher: Object.entries(PERMISSIONS).filter(([key]) => key.includes("VOUCHER")),
    };

    const handlePermissionChange = (permission) => {
        console.log("Current permissions:", formData.permissions);
        console.log("Toggling permission:", permission);
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!isEditMode) {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "Birth date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (validate()) {
            setIsSubmitting(true);
            try {
                await onSuccess(formData);
                onClose();
            } catch (error) {
                setSubmitError(
                    error.message === "User already exists"
                        ? "Username already exists. Please choose another."
                        : "Failed to save user. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" className="text-light">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{isEditMode ? "Edit User" : "Add New User"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Username*</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-dark text-light border-secondary">
                                <FaUser />
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                isInvalid={!!errors.username}
                                className="bg-dark text-light border-secondary"
                            />
                            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Birth Date*</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            isInvalid={!!errors.birthDate}
                            className="bg-dark text-light border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                    </Form.Group>

                    {!isEditMode && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Password*</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaLock />
                                    </span>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        isInvalid={!!errors.password}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-light"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Confirm Password*</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaLock />
                                    </span>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        isInvalid={!!errors.confirmPassword}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </>
                    )}

                    {isEditMode && (
                        <div className="mt-4">
                            <h5 className="mb-3 text-light">Permissions</h5>
                            <Row>
                                {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                                    <Col md={6} key={groupName} className="mb-4">
                                        <div className="card bg-dark border-secondary">
                                            <div className="card-header bg-dark border-secondary">
                                                <h6 className="mb-0 text-light">{groupName} Permissions</h6>
                                            </div>
                                            <div className="card-body">
                                                {permissions.map(([key, value]) => {
                                                    const isChecked = formData.permissions.includes(value);
                                                    return (
                                                        <Form.Check
                                                            key={key}
                                                            type="checkbox"
                                                            id={`permission-${key}`}
                                                            label={key.split("_").join(" ").toLowerCase()}
                                                            checked={isChecked}
                                                            onChange={() => handlePermissionChange(value)}
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
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditMode ? "Update User" : "Create User"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserModal;
