// src/services/goodsService.js
import axios from 'axios'; // Hoặc dùng fetch nếu bạn muốn

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Đảm bảo file .env đã được tạo và React server đã restart

const handleError = (error, defaultMessage = 'An unexpected error occurred.') => {
    console.error('API Error:', error.response?.data || error.message || error);
    const message = error.response?.data?.message || error.response?.data?.error || error.message || defaultMessage;
    throw new Error(message);
};

const handleApiResponse = (response, errorMessage, expectArray = true) => {
    if (response.data && response.data.code === 1000 && response.data.result !== undefined) {
        if (expectArray && !Array.isArray(response.data.result)) {
            console.warn(`API Response Warning: Expected array for result, but got:`, response.data.result);
            return []; // Trả về mảng rỗng nếu kỳ vọng mảng nhưng không phải
        }
        return response.data.result;
    }
    // Xử lý GoodsDetailsResponse
    if (!expectArray && response.data && response.data.goods !== undefined && response.data.reviews !== undefined) {
        return response.data;
    }
    const msg = response.data?.message || errorMessage || 'Invalid data structure from API.';
    console.error('API Response Error:', msg, response.data);
    if (expectArray) return []; // Trả về mảng rỗng nếu lỗi và kỳ vọng mảng
    throw new Error(msg);
};

export const getAllGoods = async () => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/all-goods`);
        return handleApiResponse(response, 'Failed to fetch all goods.');
    } catch (error) {
        return handleError(error, 'Failed to fetch all goods.');
    }
};
    
export const getGoodsById = async (goodsId) => { 
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!goodsId) return handleError(new Error("Goods ID is required."));
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/by-id/${goodsId}`);
        return handleApiResponse(response, `Failed to fetch good ID ${goodsId}.`, false); // Expect object
    } catch (error) {
        return handleError(error, `Failed to fetch good ID ${goodsId}.`);
    }
};

export const getGoodsByCategoryAPI = async (categoryName) => { // ĐÚNG THEO OpenAPI MỚI
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!categoryName) return [];
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/goodsCategory?goodsCategory=${encodeURIComponent(categoryName)}`);
        return handleApiResponse(response, `Failed to fetch goods for category: ${categoryName}.`);
    } catch (error) {
        console.warn(`Fetching category '${categoryName}' failed, returning empty array. Error: ${error.message}`);
        return [];
    }
};

export const getGoodsByBrandAPI = async (brandName) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!brandName) return [];
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/by-brand/${encodeURIComponent(brandName)}`);
        return handleApiResponse(response, `Failed to fetch goods for brand: ${brandName}.`);
    } catch (error) {
        console.warn(`Fetching brand '${brandName}' failed, returning empty array. Error: ${error.message}`);
        return [];
    }
};

export const getGoodsByExactPriceAPI = async (price) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (price === undefined || price === null || isNaN(Number(price))) return [];
    try {
        // OpenAPI mô tả param là "goodsPrice", endpoint là "/goods/by-price"
        const response = await axios.get(`${API_BASE_URL}/goods/by-price?goodsPrice=${price}`);
        return handleApiResponse(response, `Failed to fetch goods for price: ${price}.`);
    } catch (error) {
        console.warn(`Fetching price '${price}' failed, returning empty array. Error: ${error.message}`);
        return [];
    }
};

export const getGoodsByPriceAPI = async (price) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (price === undefined || price === null || isNaN(Number(price))) {
        return handleError(new Error("Valid price is required."));
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/by-price?goodsPrice=${price}`);
        const result = handleApiResponse(response, `Failed to fetch goods for price: ${price}.`);
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error(`Error in getGoodsByPriceAPI for ${price}:`, error.message);
        return [];
    }
};

export const getGoodsReviewsAPI = async (goodsId) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!goodsId) return handleError(new Error("Goods ID is required."));
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/${goodsId}/reviews`);
        const result = handleApiResponse(response, `Failed to fetch reviews for good ID: ${goodsId}.`);
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error(`Error in getGoodsReviewsAPI for ${goodsId}:`, error.message);
        return [];
    }
};
export const getGoodsWithReviewsAPI = async (goodsId) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!goodsId) return handleError(new Error("Goods ID is required."));
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/details/${goodsId}`);
        if (response.data && response.data.goods) { // Kiểm tra có goods là được
            return response.data;
        } else {
             // Xử lý trường hợp BE trả về lỗi 500 nhưng có body string (như trong GoodsController)
            if (response.data && typeof response.data === 'string' && response.status >= 400) {
                throw new Error(response.data);
            }
            throw new Error('Invalid data structure from /goods/details API.');
        }
    } catch (error) {
        return handleError(error, `Failed to fetch goods details with reviews for ID ${goodsId}.`);
    }
};

export const createGoodsReviewAPI = async (goodsId, reviewData) => {
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!goodsId) return handleError(new Error("Goods ID is required for creating review."));
    if (!reviewData || typeof reviewData.rating !== 'number' || !reviewData.comment) {
        return handleError(new Error("Review data (rating and comment) is required."));
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/goods/${goodsId}/reviews`, reviewData);
        return handleApiResponse(response, 'Failed to create review.');
    } catch (error) {
        return handleError(error, 'Failed to create review.');
    }
};

export const searchGoodsByNameAPI = async (searchTerm) => { 
    if (!API_BASE_URL) return handleError(new Error("API base URL is not configured."));
    if (!searchTerm) return [];
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/goodsName?goodsName=${encodeURIComponent(searchTerm)}`);
        return handleApiResponse(response, `Failed to search goods: ${searchTerm}.`);
    } catch (error) {
        console.warn(`Search for '${searchTerm}' failed, returning empty array. Error: ${error.message}`);
        return []; // Trả về mảng rỗng khi có lỗi để UI không bị vỡ
    }
};