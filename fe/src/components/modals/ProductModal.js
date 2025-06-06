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
        imageFile: null,
        goodsVersion: "1.0",
        status: "In Stock",
    });
    const [previewImage, setPreviewImage] = useState(null);
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
                imageFile: null,
                goodsVersion: product.version || "1.0",
                status: determineStatus(product.stock) || "In Stock",
            });
            // Set the preview image from existing product
            if (product.image) {
                setPreviewImage(product.image);
            }
        } else {
            setFormData({
                goodsName: "",
                goodsDescription: "",
                goodsCategory: "",
                goodsBrand: "",
                price: "",
                quantity: "",
                imageFile: null,
                goodsVersion: "1.0",
                status: "In Stock",
            });
            setPreviewImage(null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                imageFile: file
            }));
            
            // Create preview URL
            const previewURL = URL.createObjectURL(file);
            setPreviewImage(previewURL);
        }
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

        // Image validation only for new products
        if (!isEditMode && !formData.imageFile && !previewImage) {
            newErrors.imageFile = "Product image is required";
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
                // Create FormData object
                const submitFormData = new FormData();
                submitFormData.append("goodsName", formData.goodsName);
                submitFormData.append("goodsDescription", formData.goodsDescription);
                submitFormData.append("goodsCategory", formData.goodsCategory);
                submitFormData.append("goodsBrand", formData.goodsBrand);
                submitFormData.append("price", Number(formData.price));
                submitFormData.append("quantity", Number(formData.quantity));
                submitFormData.append("goodsVersion", formData.goodsVersion);

                // Handle image upload
                if (formData.imageFile) {
                    submitFormData.append("imageFile", formData.imageFile);
                }

                // If editing, append the product ID and handle image differently
                if (isEditMode) {
                    submitFormData.append("goodsId", product.id);
                    
                    // If no new image is uploaded but there's an existing image
                    if (!formData.imageFile && previewImage === product.image) {
                        submitFormData.append("goodsImageURL", product.image);
                    }
                }

                await onSuccess(submitFormData, isEditMode);
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
                                <Form.Label>Price (₫)</Form.Label>
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
                        <Form.Label>Product Image</Form.Label>
                        <div className="d-flex align-items-center gap-3">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-light border-secondary">
                                    <FaImage />
                                </span>
                                <Form.Control
                                    type="file"
                                    name="imageFile"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    isInvalid={!!errors.imageFile}
                                    className="bg-dark text-light border-secondary"
                                />
                                <Form.Control.Feedback type="invalid">{errors.imageFile}</Form.Control.Feedback>
                            </div>
                            {previewImage && (
                                <div style={{ width: '100px', height: '100px' }}>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            )}
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
