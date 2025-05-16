import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Table, Button, Container, Form, Row, Col, Badge, Pagination } from "react-bootstrap";

const Orders = () => {
    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // Number of orders to display per page

    // Mock data
    const orders = [
        { id: "#1234", customer: "John Doe", date: "2023-06-20", status: "Completed", items: 3, total: "$129.99" },
        { id: "#1235", customer: "Jane Smith", date: "2023-06-19", status: "Processing", items: 2, total: "$79.99" },
        { id: "#1236", customer: "Bob Johnson", date: "2023-06-18", status: "Pending", items: 5, total: "$249.99" },
        { id: "#1237", customer: "Alice Brown", date: "2023-06-17", status: "Completed", items: 1, total: "$59.99" },
        {
            id: "#1238",
            customer: "Charlie Wilson",
            date: "2023-06-16",
            status: "Cancelled",
            items: 4,
            total: "$189.99",
        },
        { id: "#1239", customer: "Eva Green", date: "2023-06-15", status: "Completed", items: 2, total: "$99.99" },
        { id: "#1240", customer: "David Miller", date: "2023-06-14", status: "Processing", items: 3, total: "$149.99" },
        { id: "#1241", customer: "Grace Lee", date: "2023-06-13", status: "Pending", items: 1, total: "$29.99" },
    ];

    // Calculate pagination values
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

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

    return (
        <Container fluid className="py-4 bg-dark text-light">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-light">Orders</h1>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search orders..."
                            className="bg-dark text-light border-secondary"
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Select className="bg-dark text-light border-secondary">
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Control type="date" className="bg-dark text-light border-secondary" />
                    </Form.Group>
                </Col>
            </Row>

            <Table responsive hover variant="dark" className="border-secondary">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>
                                <span
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${
                                        order.status === "Completed"
                                            ? "bg-success-subtle text-success-emphasis"
                                            : order.status === "Processing"
                                            ? "bg-primary-subtle text-primary-emphasis"
                                            : order.status === "Pending"
                                            ? "bg-warning-subtle text-warning-emphasis"
                                            : "bg-danger-subtle text-danger-emphasis"
                                    }`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td>{order.items}</td>
                            <td>{order.total}</td>
                            <td>
                                <Button variant="outline-info" size="sm">
                                    <FaEye />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4">
                <Pagination className="pagination-dark">
                    <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1} className="text-light" />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageChange(number)}
                            className={number === currentPage ? "active" : "text-light"}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="text-light"
                    />
                </Pagination>
            </div>
        </Container>
    );
};

export default Orders;
