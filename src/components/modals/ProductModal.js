import React, { useState, useEffect } from "react";
import { FaTimes, FaBox, FaLayerGroup, FaDollarSign, FaWarehouse, FaImage } from "react-icons/fa";
import "./ProductModal.css";

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
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {submitError && <div className="modal-error">{submitError}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Product Name</label>
                        <div className="input-with-icon">
                            <FaBox className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? "error" : ""}
                            />
                        </div>
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Enter product description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <div className="input-with-icon">
                            <FaLayerGroup className="input-icon" />
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? "error" : ""}
                            >
                                <option value="">Select a category</option>
                                <option value="Phones">Phone</option>
                                <option value="Laptops">Laptop</option>
                                <option value="Tablets">Tablet</option>
                                <option value="Audio">Audio</option>
                                <option value="Wearables">Wearable</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Cameras">Camera</option>
                            </select>
                        </div>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price ($)</label>
                            <div className="input-with-icon price-input">
                                <FaDollarSign className="input-icon" />
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={errors.price ? "error" : ""}
                                />
                            </div>
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">Stock Quantity</label>
                            <div className="input-with-icon">
                                <FaWarehouse className="input-icon" />
                                <input
                                    type="text"
                                    id="stock"
                                    name="stock"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className={errors.stock ? "error" : ""}
                                />
                            </div>
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL</label>
                        <div className="input-with-icon">
                            <FaImage className="input-icon" />
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
