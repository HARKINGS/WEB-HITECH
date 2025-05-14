import React, { useState, useEffect } from "react";
import { FaTimes, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { PERMISSIONS } from "../../constants/permissions";
import "./UserModal.css";

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
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditMode ? "Edit User" : "Add New User"}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {submitError && <div className="modal-error">{submitError}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="username">Username*</label>
                        <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className={errors.username ? "error" : ""}
                            />
                        </div>
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthDate">Birth Date*</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className={errors.birthDate ? "error" : ""}
                        />
                        {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                    </div>

                    {!isEditMode && (
                        <>
                            <div className="form-group">
                                <label htmlFor="password">Password*</label>
                                <div className="input-with-icon">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={errors.password ? "error" : ""}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password*</label>
                                <div className="input-with-icon">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={errors.confirmPassword ? "error" : ""}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <span className="error-message">{errors.confirmPassword}</span>
                                )}
                            </div>
                        </>
                    )}

                    {isEditMode && (
                        <div className="form-group permissions-section">
                            <label>Permissions</label>
                            <div className="permissions-grid">
                                {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                                    <div key={groupName} className="permission-group">
                                        <h3>{groupName} Permissions</h3>
                                        {permissions.map(([key, value]) => {
                                            const isChecked =
                                                Array.isArray(formData.permissions) &&
                                                formData.permissions.some((p) => p === value);
                                            return (
                                                <div key={key} className="permission-item">
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handlePermissionChange(value)}
                                                        />
                                                        <span>{key.split("_").join(" ").toLowerCase()}</span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : isEditMode ? "Update User" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
