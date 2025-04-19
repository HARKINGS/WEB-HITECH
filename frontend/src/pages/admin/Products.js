import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/AdminPages.css';

const Products = () => {
    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; // Number of products to display per page

    // Mock data for products
    const products = [
        { id: 1, name: 'Smartphone X', category: 'Phones', price: '$799.99', stock: 24, status: 'In Stock' },
        { id: 2, name: 'Laptop Pro', category: 'Laptops', price: '$1299.99', stock: 8, status: 'In Stock' },
        { id: 3, name: 'Wireless Earbuds', category: 'Audio', price: '$129.99', stock: 42, status: 'In Stock' },
        { id: 4, name: 'Smart Watch', category: 'Wearables', price: '$249.99', stock: 0, status: 'Out of Stock' },
        { id: 5, name: 'Bluetooth Speaker', category: 'Audio', price: '$89.99', stock: 15, status: 'In Stock' },
        { id: 6, name: 'Gaming Console', category: 'Gaming', price: '$499.99', stock: 3, status: 'Low Stock' },
        { id: 7, name: 'Digital Camera', category: 'Cameras', price: '$649.99', stock: 7, status: 'In Stock' },
        { id: 8, name: 'Tablet Pro', category: 'Tablets', price: '$399.99', stock: 18, status: 'In Stock' },
    ];

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

    return (
        <div className="admin-page products">
            <div className="page-header">
                <h1>Products</h1>
                <button className="btn btn-primary">
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
                                    <button className="btn-icon edit"><FaEdit /></button>
                                    <button className="btn-icon delete"><FaTrash /></button>
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
