import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Pagination } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import VoucherModal from "../../components/modals/VoucherModal";
import axios from "axios";

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vouchersPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    // For search/filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValidated, setFilterValidated] = useState("all");

    const fetchVouchers = async () => {
        setLoading(true);
        setError(null);
        try {
            // const token = document.cookie
            //     .split("; ")
            //     .find((row) => row.startsWith("token="))
            //     ?.split("=")[1];

            // if (!token) {
            //     throw new Error("Authentication token not found");
            // }

            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/vouchers`, {});

            if (response.data.code === 1000) {
                setVouchers(response.data.result);
            } else {
                throw new Error("Failed to fetch vouchers");
            }
        } catch (err) {
            console.error("Error fetching vouchers:", err);
            setError("Failed to load vouchers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    // Filter vouchers based on search term and validation status
    const filteredVouchers = vouchers.filter((voucher) => {
        const matchesSearch =
            voucher.voucherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.voucherDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voucher.identifiedVoucherId.toString().includes(searchTerm);

        const matchesValidation =
            filterValidated === "all" ||
            (filterValidated === "true" && voucher.validated) ||
            (filterValidated === "false" && !voucher.validated);

        return matchesSearch && matchesValidation;
    });

    // Calculate pagination values
    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);
    const totalPages = Math.ceil(filteredVouchers.length / vouchersPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    // Generate page numbers array
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleCreateVoucher = () => {
        setSelectedVoucher(null);
        setShowModal(true);
    };

    const handleDeleteVoucher = async (voucherId) => {
        if (window.confirm("Are you sure you want to delete this voucher?")) {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/vouchers/${voucherId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.code === 1000) {
                    await fetchVouchers(); // Refresh the list
                } else {
                    throw new Error("Failed to delete voucher");
                }
            } catch (error) {
                console.error("Error deleting voucher:", error);
                alert("Failed to delete voucher. Please try again.");
            }
        }
    };

    const handleVoucherSubmit = async (formData) => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Create new voucher with the new data format
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vouchers`, {
                voucherName: formData.voucherName,
                voucherDescription: formData.voucherDescription,
                discountAmount: formData.discountAmount,
                expiryDate: formData.expiryDate,
                identifiedVoucherId: formData.identifiedVoucherId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data.code !== 1000) {
                throw new Error(response.data.message || "Failed to create voucher");
            }

            await fetchVouchers(); // Refresh the list
        } catch (error) {
            console.error("Error saving voucher:", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
                <div>Loading vouchers...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)" }}>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4" style={{ backgroundColor: "var(--background-primary)", color: "var(--text-primary)" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Vouchers</h1>
                <Button variant="primary" onClick={handleCreateVoucher}>
                    <FaPlus className="me-1" /> Create New Voucher
                </Button>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search vouchers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}
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
                            value={filterValidated}
                            onChange={(e) => setFilterValidated(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="true">Valid</option>
                            <option value="false">Invalid</option>
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
                        <th>Description</th>
                        <th>Discount</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVouchers.map((voucher) => (
                        <tr key={voucher.voucherId}>
                            <td>{voucher.identifiedVoucherId}</td>
                            <td>{voucher.voucherName}</td>
                            <td>{voucher.voucherDescription}</td>
                            <td>{voucher.discountAmount}%</td>
                            <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td>
                            <td>
                                <span
                                    className={`d-inline-flex align-items-center rounded-pill px-3 py-1 small fw-semibold ${
                                        new Date(voucher.expiryDate) > new Date()
                                            ? "bg-success-subtle text-success-emphasis"
                                            : "bg-danger-subtle text-danger-emphasis"
                                    }`}
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    {new Date(voucher.expiryDate) > new Date() ? "Valid" : "Expired"}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    disabled
                                    title="Edit functionality not available"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteVoucher(voucher.voucherId)}
                                >
                                    <FaTrash />
                                </Button>
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

            <VoucherModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={handleVoucherSubmit}
            />
        </Container>
    );
};

export default Vouchers;
