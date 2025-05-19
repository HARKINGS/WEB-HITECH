import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { Table, Button, Container, Form, Row, Col, Badge, Pagination } from "react-bootstrap";
import ProductModal from "../../components/modals/ProductModal";
import { PERMISSIONS } from "../../constants/permissions";

// Helper function to decode JWT token
const decodeJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

// Helper function to check if user has required permission
const hasPermission = (token, requiredPermission) => {
    const decodedToken = decodeJwt(token);
    if (!decodedToken || !decodedToken.scope) return false;
    return decodedToken.scope.split(" ").includes(requiredPermission);
};

const Products = () => {
    // Add state for modal and products management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [permissions, setPermissions] = useState({
        canEdit: false,
        canDelete: false,
        canCreate: false,
    });
    const productsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // Check permissions on component mount
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            setPermissions({
                canEdit: hasPermission(token, PERMISSIONS.UPDATE_GOODS),
                canDelete: hasPermission(token, PERMISSIONS.DELETE_GOODS),
                canCreate: hasPermission(token, PERMISSIONS.CREATE_GOODS),
            });
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/goods/all-goods`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.code.toString() === "1000") {
                const mappedProducts = response.data.result.map((product) => ({
                    id: product.goodsId,
                    name: product.goodsName,
                    category: product.goodsCategory,
                    brand: product.goodsBrand,
                    price: product.price,
                    stock: product.quantity,
                    description: product.goodsDescription,
                    image: product.goodsImageURL,
                    version: product.goodsVersion,
                    status: determineStatus(product.quantity),
                }));
                setProducts(mappedProducts);
            } else {
                throw new Error("Failed to fetch products");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
            setLoading(false);
        }
    }, []);

    // Fetch products from API or use mock data
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handle adding a new product
    const handleAddProduct = () => {
        setCurrentProduct(null); // Ensure we're in create mode, not edit mode
        setIsModalOpen(true);
    };

    // Handle editing a product
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    // Handle product modal success
    const handleProductSuccess = async (formData, isEditMode) => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            let response;
            if (isEditMode) {
                // Update existing product
                response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/goods/${currentProduct.id}`,
                    formData,
                    config
                );
            } else {
                // Add new product
                response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/goods`,
                    formData,
                    config
                );
            }

            if (response.data.code.toString() === "1000") {
                await fetchProducts(); // Reload products after operation
                setIsModalOpen(false);
            } else {
                throw new Error(isEditMode ? "Failed to update product" : "Failed to create product");
            }
        } catch (err) {
            console.error("Error saving product:", err);
            const errorMessage = err.response?.data?.message || 
                               (isEditMode ? "Failed to update product" : "Failed to create product");
            alert(`${errorMessage}. Please try again.`);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];
                const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/goods/${productId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.code.toString() === "1000") {
                    await fetchProducts(); // Reload products after deletion
                } else {
                    throw new Error("Failed to delete product");
                }
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    // Filter products based on search, category and status
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesStatus = !selectedStatus || product.status.toLowerCase().replace(" ", "-") === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Calculate pagination values using filtered products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Helper function to determine status
    const determineStatus = (quantity) => {
        if (quantity <= 0) return "Out of Stock";
        if (quantity <= 5) return "Low Stock";
        return "In Stock";
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'In Stock':
                return 'bg-success-subtle text-success-emphasis';
            case 'Out of Stock':
                return 'bg-danger-subtle text-danger-emphasis';
            case 'Low Stock':
                return 'bg-warning-subtle text-warning-emphasis';
            default:
                return 'bg-secondary-subtle text-secondary-emphasis';
        }
    };

    if (loading) {
        return (
            <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
                <div>Loading products...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)" }}>
                <div style={{ color: "var(--price-color)" }}>Error: {error}</div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
            {/* Product creation/edit modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={currentProduct}
                onSuccess={handleProductSuccess}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Products</h1>
                {permissions.canCreate && (
                    <Button variant="primary" onClick={handleAddProduct}>
                        <FaPlus className="me-2" /> Add New Product
                    </Button>
                )}
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search products..."
                            style={{
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Select
                            style={{
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Phone">Phone</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Audio">Audio</option>
                            <option value="Wearable">Wearable</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Camera">Camera</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Select
                            style={{
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="in-stock">In Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                            <option value="low-stock">Low Stock</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Table responsive hover style={{
                "--bs-table-bg": "var(--background-secondary)",
                "--bs-table-color": "var(--text-primary)",
                "--bs-table-border-color": "var(--border-color)",
                "--bs-table-hover-bg": "var(--background-primary)",
                "--bs-table-hover-color": "var(--text-primary)"
            }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td style={{ color: "var(--price-color)" }}>₫{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <span
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${getStatusVariant(product.status)}`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {product.status}
                                </span>
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    {permissions.canEdit && (
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <FaEdit />
                                        </Button>
                                    )}
                                    {permissions.canDelete && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4">
                <Pagination style={{ "--bs-pagination-bg": "var(--background-secondary)", "--bs-pagination-color": "var(--text-primary)" }}>
                    <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1} />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageChange(number)}
                            style={number === currentPage ? {
                                backgroundColor: "var(--accent-color)",
                                borderColor: "var(--accent-color)",
                                color: "var(--text-on-accent)"
                            } : {}}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={handleNext} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </Container>
    );
};

export default Products;
