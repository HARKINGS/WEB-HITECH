// src/services/voucherService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper functions (tương tự như trong goodsService)
const handleError = (error, defaultMessage = 'An unexpected error occurred.') => {
    console.error('Voucher API Error:', error.response?.data || error.message || error);
    const message = error.response?.data?.message || error.response?.data?.error || error.message || defaultMessage;
    throw new Error(message);
};

const handleApiResponse = (response, errorMessage, expectArray = true) => {
    if (response.data && response.data.code === 1000 && response.data.result !== undefined) {
        if (expectArray && !Array.isArray(response.data.result)) {
            console.warn(`API Response Warning: Expected array for result, but got:`, response.data.result);
            return [];
        }
        return response.data.result;
    }
    const msg = response.data?.message || errorMessage || 'Invalid data structure from voucher API.';
    console.error('Voucher API Response Error:', msg, response.data);
    if (expectArray) return [];
    throw new Error(msg);
};

/**
 * Fetches all available vouchers.
 * API: GET /vouchers
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of voucher objects.
 */
export const getAllVouchersAPI = async () => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured for vouchers."));
    try {
        const response = await axios.get(`${API_BASE_URL}/vouchers`);
        return handleApiResponse(response, 'Failed to fetch vouchers.');
    } catch (error) {
        return handleError(error, 'Failed to fetch vouchers.');
    }
};

/**
 * Fetches a specific voucher by its ID (hoặc mã code mà người dùng nhập).
 * API: GET /vouchers/{voucherIdOrCode}
 * @param {string} voucherIdOrCode - The ID or code of the voucher.
 * @returns {Promise<Object>} A promise that resolves to the voucher object.
 */
export const getVoucherByIdAPI = async (voucherIdOrCode) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured for vouchers."));
    if (!voucherIdOrCode) return handleError(new Error("Voucher ID or code is required."));
    try {
        const response = await axios.get(`${API_BASE_URL}/vouchers/${voucherIdOrCode}`);
        return handleApiResponse(response, `Failed to fetch voucher: ${voucherIdOrCode}.`, false); // Expect object
    } catch (error) {
        // BE có thể trả về lỗi 404 nếu voucher không tồn tại, cần xử lý ở component gọi
        return handleError(error, `Failed to fetch voucher: ${voucherIdOrCode}.`);
    }
};