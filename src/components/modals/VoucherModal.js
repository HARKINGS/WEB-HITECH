import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaTicketAlt, FaPercent } from "react-icons/fa";

const VoucherModal = ({ isOpen, onClose, voucher, onSuccess }) => {
    const [formData, setFormData] = useState({
        identifiedVoucherId: "",
        voucherName: "",
        voucherDescription: "",
        discountAmount: "",
        expiryDate: "",
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!voucher;

    useEffect(() => {
        if (voucher) {
            setFormData({
                identifiedVoucherId: voucher.identifiedVoucherId || "",
                voucherName: voucher.voucherName || "",
                voucherDescription: voucher.voucherDescription || "",
                discountAmount: voucher.discountAmount || "",
                expiryDate: voucher.expiryDate ? voucher.expiryDate.split("T")[0] : "",
            });
        } else {
            setFormData({
                identifiedVoucherId: "",
                voucherName: "",
                voucherDescription: "",
                discountAmount: "",
                expiryDate: "",
            });
        }
        setErrors({});
        setSubmitError("");
    }, [voucher, isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!formData.identifiedVoucherId) {
            newErrors.identifiedVoucherId = "Voucher ID is required";
        }

        if (!formData.voucherName.trim()) {
            newErrors.voucherName = "Voucher name is required";
        }

        if (!formData.voucherDescription.trim()) {
            newErrors.voucherDescription = "Description is required";
        }

        if (!formData.discountAmount || formData.discountAmount <= 0) {
            newErrors.discountAmount = "Discount amount must be greater than 0";
        } else if (formData.discountAmount > 100) {
            newErrors.discountAmount = "Discount amount cannot exceed 100%";
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
        } else {
            const expiryDate = new Date(formData.expiryDate);
            const today = new Date();
            if (expiryDate < today) {
                newErrors.expiryDate = "Expiry date must be in the future";
            }
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
                // Convert discountAmount to number before submitting
                const submitData = {
                    ...formData,
                    discountAmount: Number(formData.discountAmount),
                    identifiedVoucherId: Number(formData.identifiedVoucherId)
                };
                await onSuccess(submitData);
                onClose();
            } catch (error) {
                setSubmitError(
                    error.message === "Voucher already exists"
                        ? "A voucher with this ID already exists"
                        : "Failed to save voucher. Please try again."
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" style={{
            "--bs-modal-bg": "var(--background-secondary)",
            "--bs-modal-color": "var(--text-primary)",
            "--bs-modal-border-color": "var(--border-color)"
        }}>
            <Modal.Header closeButton style={{ borderBottom: "1px solid var(--border-color)" }}>
                <Modal.Title>
                    <FaTicketAlt className="me-2" />
                    {isEditMode ? "Edit Voucher" : "Create New Voucher"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Voucher ID*</Form.Label>
                        <Form.Control
                            type="number"
                            name="identifiedVoucherId"
                            placeholder="Enter voucher ID"
                            value={formData.identifiedVoucherId}
                            onChange={handleChange}
                            isInvalid={!!errors.identifiedVoucherId}
                            disabled={isEditMode}
                            style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.identifiedVoucherId}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Voucher Name*</Form.Label>
                        <Form.Control
                            type="text"
                            name="voucherName"
                            placeholder="Enter voucher name"
                            value={formData.voucherName}
                            onChange={handleChange}
                            isInvalid={!!errors.voucherName}
                            style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.voucherName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description*</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="voucherDescription"
                            placeholder="Enter voucher description"
                            value={formData.voucherDescription}
                            onChange={handleChange}
                            isInvalid={!!errors.voucherDescription}
                            style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.voucherDescription}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Discount Amount (%)*</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                name="discountAmount"
                                placeholder="Enter discount percentage"
                                value={formData.discountAmount}
                                onChange={handleChange}
                                isInvalid={!!errors.discountAmount}
                                min="0"
                                max="100"
                                style={{
                                    backgroundColor: "var(--background-primary)",
                                    color: "var(--text-primary)",
                                    border: "1px solid var(--border-color)"
                                }}
                            />
                            <InputGroup.Text style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}>
                                <FaPercent />
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">{errors.discountAmount}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Expiry Date*</Form.Label>
                        <Form.Control
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            isInvalid={!!errors.expiryDate}
                            min={new Date().toISOString().split("T")[0]}
                            style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: "1px solid var(--border-color)" }}>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Voucher" : "Create Voucher"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VoucherModal;
