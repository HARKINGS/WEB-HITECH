import React, { useState, useEffect } from "react";
import { FaTimes, FaBox, FaLayerGroup, FaDollarSign, FaWarehouse, FaImage } from "react-icons/fa";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ProductModal = ({ isOpen, onClose, product = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        imageUrl: "",
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
                name: product.name || "",
                description: product.description || "",
                category: product.category || "",
                price: product.price?.toString() || "",
                stock: product.stock?.toString() || "",
                imageUrl: product.image || "", // Updated to match API field name
                status: determineStatus(product.stock) || "In Stock",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                category: "",
                price: "",
                stock: "",
                imageUrl: "",
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
        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        // Category validation
        if (!formData.category.trim()) {
            newErrors.category = "Category is required";
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }

        // Stock validation
        if (!formData.stock) {
            newErrors.stock = "Stock quantity is required";
        } else if (
            isNaN(Number(formData.stock)) ||
            !Number.isInteger(Number(formData.stock)) ||
            Number(formData.stock) < 0
        ) {
            newErrors.stock = "Stock must be a non-negative integer";
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
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    image: formData.imageUrl, // Updated to match API field name
                };

                onSuccess(submissionData);
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
                                name="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                                className="bg-dark text-light border-secondary"
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={3}
                            placeholder="Enter product description"
                            value={formData.description}
                            onChange={handleChange}
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-dark text-light border-secondary">
                                <FaLayerGroup />
                            </span>
                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                isInvalid={!!errors.category}
                                className="bg-dark text-light border-secondary"
                            >
                                <option value="">Select a category</option>
                                <option value="Phones">Phone</option>
                                <option value="Laptops">Laptop</option>
                                <option value="Tablets">Tablet</option>
                                <option value="Audio">Audio</option>
                                <option value="Wearables">Wearable</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Cameras">Camera</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                        </div>
                    </Form.Group>

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
                                        name="stock"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        isInvalid={!!errors.stock}
                                        className="bg-dark text-light border-secondary"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
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
                                name="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
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
