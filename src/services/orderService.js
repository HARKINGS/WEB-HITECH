// src/services/orderService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/orders`;

/**
 * Places a new order.
 * @param {Object} orderData - The order data to be sent to the backend.
 *                             This should match the structure of CreateOrderRequest.java.
 * @returns {Promise<Object>} A promise that resolves to the created order response.
 * @throws {Error} If the API request fails.
 */
export const placeOrderAPI = async (orderData) => {
    if (!process.env.REACT_APP_API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined.");
        throw new Error("API base URL is not configured.");
    }
    try {
        // Giả sử orderData đã được chuẩn bị đúng cấu trúc CreateOrderRequest
        const response = await axios.post(`${API_URL}/create`, orderData);

        if (response.data) { // Kiểm tra xem BE có trả về { code: 1000, result: OrderResponse } không
            if (response.data.code === 1000 && response.data.result) {
                return response.data.result; // Nếu BE dùng ApiResponse wrapper
            }
            return response.data; // Nếu BE trả về OrderResponse trực tiếp
        } else {
            throw new Error('Invalid response from server when placing order.');
        }
    } catch (error) {
        console.error('Error placing order:', error.response || error.message || error);
        const errorMessage = error.response?.data?.message || // Nếu BE trả về lỗi có message
                            error.response?.data?.error ||    // Hoặc lỗi dạng { "error": "..." }
                            error.message ||
                            'An unexpected error occurred while placing the order.';
        throw new Error(errorMessage);
    }
};