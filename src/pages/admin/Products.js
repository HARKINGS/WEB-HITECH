import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import ProductModal from '../../components/modals/ProductModal';
import '../../styles/AdminPages.css';

const Products = () => {
    // Add state for modal and products management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; // Number of products to display per page

    // Fetch products from API or use mock data
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // In a real scenario, this would fetch from your API
            // For now, we'll use mock data
            // const response = await axios.get('http://localhost:5000/api/products');
            // setProducts(response.data);

            // Mock data for demonstration
            const mockProducts = [
                { id: 1, name: 'Smartphone X', category: 'Phones', price: '$799.99', stock: 24, status: 'In Stock', description: 'Latest smartphone with advanced features.' },
                { id: 2, name: 'Laptop Pro', category: 'Laptops', price: '$1299.99', stock: 8, status: 'In Stock', description: 'Powerful laptop for professionals.' },
                { id: 3, name: 'Wireless Earbuds', category: 'Audio', price: '$129.99', stock: 42, status: 'In Stock', description: 'Premium sound quality with noise cancellation.' },
                { id: 4, name: 'Smart Watch', category: 'Wearables', price: '$249.99', stock: 0, status: 'Out of Stock', description: 'Track your fitness and stay connected.' },
                { id: 5, name: 'Bluetooth Speaker', category: 'Audio', price: '$89.99', stock: 15, status: 'In Stock', description: 'Portable speaker with excellent bass.' },
                { id: 6, name: 'Gaming Console', category: 'Gaming', price: '$499.99', stock: 3, status: 'Low Stock', description: 'Next-gen gaming with realistic graphics.' },
                { id: 7, name: 'Digital Camera', category: 'Cameras', price: '$649.99', stock: 7, status: 'In Stock', description: 'Capture memories in high resolution.' },
                { id: 8, name: 'Tablet Pro', category: 'Tablets', price: '$399.99', stock: 18, status: 'In Stock', description: 'Portable and powerful for productivity on the go.' }
            ];
            setProducts(mockProducts);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
            setLoading(false);
        }
    };

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
    const handleProductSuccess = (productData) => {
        if (currentProduct) {
            // Update existing product in the list
            setProducts(products.map(product =>
                product.id === productData.id ? { ...product, ...productData } : product
            ));
        } else {
            // Add new product to the list
            // In a real app, the API would return the new product with an ID
            const newProduct = {
                ...productData,
                id: Math.max(...products.map(p => p.id)) + 1
            };
            setProducts([...products, newProduct]);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                // In a real app, this would make an API call
                // await axios.delete(`http://localhost:5000/api/products/${productId}`);

                // Remove product from local state
                setProducts(products.filter(product => product.id !== productId));
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete product. Please try again.');
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
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

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
                <button className="btn btn-primary" onClick={handleAddProduct}>
                    <FaPlus /> Add New Product
                </button>
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
                        {currentProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="actions">
                                    <button
                                        className="btn-icon edit"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="btn-page"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    &laquo;
                </button>

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        className={`btn-page ${currentPage === number ? 'active' : ''}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                <button
                    className="btn-page"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Products;
