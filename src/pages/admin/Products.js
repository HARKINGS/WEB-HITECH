import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import ProductModal from "../../components/modals/ProductModal";
import "../../styles/AdminPages.css";

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

    // Check permissions on component mount
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            setPermissions({
                canEdit: hasPermission(token, "UPDATE_GOODS"),
                canDelete: hasPermission(token, "DELETE_GOODS"),
                canCreate: hasPermission(token, "CREATE_GOODS"),
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
            if (response.data.code === 1000) {
                const mappedProducts = response.data.result.map((product) => ({
                    id: product.goodsId,
                    name: product.goodsName,
                    category: product.goodsCategory,
                    price: product.price,
                    stock: product.quantity,
                    description: product.goodsDescription,
                    image: product.goodsImageUrl,
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
    }, []); // No dependencies as it only uses functions from props

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
    const handleProductSuccess = async (productData) => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            if (currentProduct) {
                // Update existing product - map to API format
                const apiData = {
                    goodsId: currentProduct.id,
                    goodsName: productData.name,
                    goodsDescription: productData.description,
                    goodsCategory: productData.category,
                    price: productData.price,
                    quantity: productData.stock,
                    goodsImageUrl: productData.image,
                    goodsVersion: currentProduct.version || "1.0",
                };

                const response = await axios.put(
                    `${process.env.REACT_APP_API_BASE_URL}/goods/${currentProduct.id}`,
                    apiData,
                    config
                );
                if (response.data.code === 1000) {
                    await fetchProducts();
                } else {
                    throw new Error("Failed to update product");
                }
            } else {
                // Add new product - map to API format
                const apiData = {
                    goodsName: productData.name,
                    goodsDescription: productData.description,
                    goodsCategory: productData.category,
                    price: productData.price,
                    quantity: productData.stock,
                    goodsImageUrl: productData.image,
                    goodsVersion: "1.0",
                };

                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/goods`, apiData, config);
                if (response.data.code === 1000) {
                    await fetchProducts();
                } else {
                    throw new Error("Failed to create product");
                }
            }
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Failed to save product. Please try again.");
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
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/goods/${productId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(products.filter((product) => product.id !== productId));
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    // Calculate pagination values
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

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

    if (loading) {
        return <div className="admin-page products">Loading products...</div>;
    }

    if (error) {
        return <div className="admin-page products">Error: {error}</div>;
    }

    return (
        <div className="admin-page products">
            {/* Product creation/edit modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={currentProduct}
                onSuccess={handleProductSuccess}
            />

            <div className="page-header">
                <h1>Products</h1>
                {permissions.canCreate && (
                    <button className="btn btn-primary" onClick={handleAddProduct}>
                        <FaPlus /> Add New Product
                    </button>
                )}
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <input type="text" placeholder="Search products..." className="filter-input" />
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Categories</option>
                        <option value="phones">Phones</option>
                        <option value="laptops">Laptops</option>
                        <option value="audio">Audio</option>
                        <option value="wearables">Wearables</option>
                        <option value="tablets">Tablets</option>
                        <option value="gaming">Gaming</option>
                        <option value="cameras">Cameras</option>
                    </select>
                </div>
                <div className="filter-group">
                    <select className="filter-select">
                        <option value="">All Status</option>
                        <option value="in-stock">In Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                        <option value="low-stock">Low Stock</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
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
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.status.toLowerCase().replace(" ", "-")}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="actions">
                                    {permissions.canEdit && (
                                        <button className="btn-icon edit" onClick={() => handleEditProduct(product)}>
                                            <FaEdit />
                                        </button>
                                    )}
                                    {permissions.canDelete && (
                                        <button
                                            className="btn-icon delete"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="btn-page" onClick={handlePrevious} disabled={currentPage === 1}>
                    &laquo;
                </button>

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`btn-page ${currentPage === number ? "active" : ""}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                <button className="btn-page" onClick={handleNext} disabled={currentPage === totalPages}>
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Products;
