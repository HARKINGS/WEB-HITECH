import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { Table, Button, Container, Form, Row, Col, Badge, Pagination, Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Orders = () => {
    // Add states
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const ordersPerPage = 5;

    // Format price to currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-success-subtle text-success-emphasis';
            case 'PROCESSING':
                return 'bg-primary-subtle text-primary-emphasis';
            case 'PENDING':
                return 'bg-warning-subtle text-warning-emphasis';
            case 'CANCELLED':
                return 'bg-danger-subtle text-danger-emphasis';
            default:
                return 'bg-secondary-subtle text-secondary-emphasis';
        }
    };

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // Transform the response data to match our table structure
                const transformedOrders = response.data.map(order => ({
                    id: order.id,
                    customer: order.user?.username || 'Anonymous',
                    date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
                    status: order.status,
                    items: order.orderItems?.length || 0,
                    total: order.totalPrice || 0,
                    paymentStatus: order.paymentStatus,
                    paymentMethod: order.paymentMethod || 'N/A',
                    shippingAddress: order.shippingAddress || 'N/A',
                    orderItems: order.orderItems || [],
                    voucher: order.voucher,
                    totalDiscount: order.totalDiscount || 0,
                    transactionId: order.transactionId
                }));

                setOrders(transformedOrders);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Handle modal open
    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

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

    // Order Details Modal
    const OrderDetailsModal = () => {
        if (!selectedOrder) return null;

        return (
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                aria-labelledby="order-details-modal"
                centered
                className="text-dark"
            >
                <Modal.Header closeButton className="bg-dark text-light">
                    <Modal.Title id="order-details-modal">
                        Order Details - #{selectedOrder.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    <div className="mb-4">
                        <h5>Order Information</h5>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Customer:</strong> {selectedOrder.customer}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Date:</strong> {selectedOrder.date}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Status:</strong>{" "}
                                <span className={`badge rounded-pill ${getStatusVariant(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Payment Status:</strong>{" "}
                                <span className={`badge rounded-pill ${getStatusVariant(selectedOrder.paymentStatus)}`}>
                                    {selectedOrder.paymentStatus}
                                </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Transaction ID:</strong> {selectedOrder.transactionId || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Shipping Address:</strong> {selectedOrder.shippingAddress || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Voucher:</strong> {selectedOrder.voucher ? selectedOrder.voucher.code : 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Total Price:</strong> {formatPrice(selectedOrder.total)}
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-light">
                                <strong>Total Discount:</strong> {formatPrice(selectedOrder.totalDiscount)}
                            </ListGroup.Item>
                        </ListGroup>
                    </div>

                    <div>
                        <h5>Order Items</h5>
                        <ListGroup variant="flush">
                            {selectedOrder.orderItems.map((item, index) => (
                                <ListGroup.Item key={item.id || index} className="bg-dark text-light">
                                    <Row>
                                        <Col>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div style={{ maxWidth: '80%' }}>
                                                    <h6 className="mb-0 text-truncate">
                                                        {item.goods.goodsName || "Unknown Product"}
                                                    </h6>
                                                    <small className="text-light">
                                                        Item ID: {item.id || "N/A"}
                                                    </small>
                                                    <br />
                                                    <small className="text-light">
                                                        Goods ID: {item.goods.goodsId || "N/A"}
                                                    </small>
                                                </div>
                                                <div style={{ minWidth: 'fit-content', marginLeft: '8px' }}>
                                                    <span
                                                        className={`d-inline-flex  px-3 py-1 small fw-semibold rounded-pill ${getStatusVariant(item.status)}`}
                                                        style={{ fontSize: "0.65rem" }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mb-1">Quantity: {item.quantity}</p>
                                            <p className="mb-0">User: {item.username || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-dark text-light">
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    if (loading) {
        return (
            <Container fluid className="py-4 bg-dark text-light">
                <div>Loading orders...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-4 bg-dark text-light">
                <div className="text-danger">Error: {error}</div>
            </Container>
        );
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
                            <option value="COMPLETED">Completed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
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
                        <th>Payment Status</th>
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
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${getStatusVariant(order.status)}`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <span
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${getStatusVariant(order.paymentStatus)}`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {order.paymentStatus}
                                </span>
                            </td>
                            <td>{order.items}</td>
                            <td>{formatPrice(order.total)}</td>
                            <td>
                                <Button variant="outline-info" size="sm" onClick={() => handleShowModal(order)}>
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

            {/* Order Details Modal */}
            <OrderDetailsModal />
        </Container>
    );
};

export default Orders;
