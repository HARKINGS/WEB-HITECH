// src/services/zalopayService.js
import axios from 'axios';

const ZALOPAY_API_URL = `${process.env.REACT_APP_API_BASE_URL}/zalopay`; // /web/zalopay

/**
 * Initiates a ZaloPay payment creation process.
 * @param {Object} paymentInitData - Data to initiate ZaloPay payment.
 *                                 Example: { orderId: "your_system_order_id", amount: 100000, description: "Order payment" }
 * @returns {Promise<Object>} A promise that resolves to the ZaloPay API response (containing order_url).
 * @throws {Error} If the API request fails.
 */
export const createZaloPayOrderAPI = async (paymentInitData) => {
    if (!process.env.REACT_APP_API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined.");
        throw new Error("API base URL is not configured.");
    }
    try {
        const response = await axios.post(`${ZALOPAY_API_URL}/create-order`, paymentInitData);
        // ZalopayController trả về response trực tiếp từ ZaloPay (đã parse) hoặc lỗi
        if (response.data && response.data.order_url) {
            return response.data; // Mong đợi { order_url: "...", zp_trans_token: "...", ... }
        } else if (response.data && response.data.error) {
            throw new Error(response.data.error);
        } else {
            // Nếu cấu trúc không như mong đợi, hoặc ZaloPay trả về lỗi mà controller không bắt được
            console.error("Unexpected response structure from /zalopay/create-order", response.data);
            throw new Error(response.data?.return_message || response.data?.message || 'Failed to initiate ZaloPay payment. Invalid server response.');
        }
    } catch (error) {
        console.error('Error initiating ZaloPay payment:', error.response?.data || error.message || error);
        const errorMessage = error.response?.data?.error || // Lỗi từ controller của bạn
                            error.response?.data?.return_message || // Lỗi từ ZaloPay (nếu controller trả về nguyên)
                            error.response?.data?.message ||
                            error.message ||
                            'An unexpected error occurred while initiating ZaloPay payment.';
        throw new Error(errorMessage);
    }
};