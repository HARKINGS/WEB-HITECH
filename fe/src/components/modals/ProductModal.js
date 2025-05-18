import React, { useState, useEffect } from "react";
import { FaTimes, FaBox, FaLayerGroup, FaDollarSign, FaWarehouse, FaImage } from "react-icons/fa";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ProductModal = ({ isOpen, onClose, product = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        goodsName: "",
        goodsDescription: "",
        goodsCategory: "",
        goodsBrand: "",
        price: "",
        quantity: "",
        goodsImageURL: "",
        goodsVersion: "1.0",
        status: "In Stock",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // If product is provided, this is an edit operation
    const isEditMode = !!product;

    useEffect(() => {
        if (product) {
            setFormData({
                goodsName: product.name || "",
                goodsDescription: product.description || "",
                goodsCategory: product.category || "",
                goodsBrand: product.brand || "",
                price: product.price?.toString() || "",
                quantity: product.stock?.toString() || "",
                goodsImageURL: product.image || "https://example.com/image.jpg",
                goodsVersion: product.version || "1.0",
                status: determineStatus(product.stock) || "In Stock",
            });
        } else {
            setFormData({
                goodsName: "",
                goodsDescription: "",
                goodsCategory: "",
                goodsBrand: "",
                price: "",
                quantity: "",
                goodsImageURL: "",
                goodsVersion: "1.0",
                status: "In Stock",
            });
        }
        setErrors({});
        setSubmitError("");
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        // Name validation
        if (!formData.goodsName.trim()) {
            newErrors.goodsName = "Product name is required";
        }

        // Category validation
        if (!formData.goodsCategory.trim()) {
            newErrors.goodsCategory = "Category is required";
        }

        // Brand validation
        if (!formData.goodsBrand.trim()) {
            newErrors.goodsBrand = "Brand is required";
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }

        // Stock validation
        if (!formData.quantity) {
            newErrors.quantity = "Stock quantity is required";
        } else if (
            isNaN(Number(formData.quantity)) ||
            !Number.isInteger(Number(formData.quantity)) ||
            Number(formData.quantity) < 0
        ) {
            newErrors.quantity = "Stock must be a non-negative integer";
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
                // Format the data for API
                const submissionData = {
                    goodsName: formData.goodsName,
                    goodsDescription: formData.goodsDescription,
                    goodsCategory: formData.goodsCategory,
                    goodsBrand: formData.goodsBrand,
                    price: Number(formData.price),
                    quantity: Number(formData.quantity),
                    goodsImageURL: formData.goodsImageURL || "https://example.com/image.jpg",
                    goodsVersion: formData.goodsVersion,
                };

                await onSuccess(submissionData);
                onClose();
            } catch (error) {
                console.error("Form submission error:", error);
                setSubmitError(error.response?.data?.message || "Failed to save product. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Helper function to determine product status based on stock quantity
    const determineStatus = (stock) => {
        if (stock <= 0) return "Out of Stock";
        if (stock <= 5) return "Low Stock";
        return "In Stock";
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" className="text-light">
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title>{isEditMode ? "Edit Product" : "Add New Product"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-light">
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-dark text-light border-secondary">
                                <FaBox />
                            </span>
                            <Form.Control
                                type="text"
                                name="goodsName"
                                placeholder="Enter product name"
                                value={formData.goodsName}
                                onChange={handleChange}
                                isInvalid={!!errors.goodsName}
                                className="bg-dark text-light border-secondary"
                            />
                            <Form.Control.Feedback type="invalid">{errors.goodsName}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="goodsDescription"
                            rows={3}
                            placeholder="Enter product description"
                            value={formData.goodsDescription}
                            onChange={handleChange}
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaLayerGroup />
                                    </span>
                                    <Form.Select
                                        name="goodsCategory"
                                        value={formData.goodsCategory}
                                        onChange={handleChange}
                                        isInvalid={!!errors.goodsCategory}
                                        className="bg-dark text-light border-secondary"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Phone">Phone</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Wearable">Wearable</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Camera">Camera</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.goodsCategory}</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Brand</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaLayerGroup />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        name="goodsBrand"
                                        placeholder="Enter brand name"
                                        value={formData.goodsBrand}
                                        onChange={handleChange}
                                        isInvalid={!!errors.goodsBrand}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.goodsBrand}</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price ($)</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaDollarSign />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        name="price"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        isInvalid={!!errors.price}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock Quantity</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-secondary">
                                        <FaWarehouse />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        name="quantity"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        isInvalid={!!errors.quantity}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-dark text-light border-secondary">
                                <FaImage />
                            </span>
                            <Form.Control
                                type="text"
                                name="goodsImageURL"
                                placeholder="https://example.com/image.jpg"
                                value={formData.goodsImageURL}
                                onChange={handleChange}
                                className="bg-dark text-light border-secondary"
                            />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="bg-dark border-secondary">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;
