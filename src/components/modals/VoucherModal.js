import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaTicketAlt } from "react-icons/fa";

const VoucherModal = ({ isOpen, onClose, voucher, onSuccess }) => {
    const [formData, setFormData] = useState({
        identifiedVoucherId: "",
        voucherName: "",
        voucherDescription: "",
        expiryDate: "",
        validated: true,
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
                expiryDate: voucher.expiryDate ? voucher.expiryDate.split("T")[0] : "",
                validated: voucher.validated ?? true,
            });
        } else {
            setFormData({
                identifiedVoucherId: "",
                voucherName: "",
                voucherDescription: "",
                expiryDate: "",
                validated: true,
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
                await onSuccess(formData);
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
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" className="text-light">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>
                    <FaTicketAlt className="me-2" />
                    {isEditMode ? "Edit Voucher" : "Create New Voucher"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
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
                            className="bg-dark text-light border-secondary"
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
                            className="bg-dark text-light border-secondary"
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
                            className="bg-dark text-light border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">{errors.voucherDescription}</Form.Control.Feedback>
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
                            className="bg-dark text-light border-secondary"
                        />
                        <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="validated"
                            name="validated"
                            label="Voucher is valid"
                            checked={formData.validated}
                            onChange={handleChange}
                            className="text-light"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
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
