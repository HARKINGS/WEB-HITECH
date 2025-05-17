// src/services/goodsService.js
import axios from 'axios'; // Hoặc dùng fetch nếu bạn muốn

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Đảm bảo file .env đã được tạo và React server đã restart

/**
 * Fetches all goods from the API.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of goods.
 * @throws {Error} If the API request fails.
 */
export const getAllGoods = async () => {
    if (!API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined. Please check your .env file and restart the server.");
        throw new Error("API base URL is not configured.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/all-goods`);
        if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
            return response.data.result; // Trả về mảng các sản phẩm
        } else {
            const errorMessage = response.data?.message || 'Failed to fetch goods or invalid data structure (expected result array).';
            console.error('Error fetching all goods:', errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('API call error to /goods/all-goods:', error.response?.data || error.message || error);
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred while fetching all goods.';
        throw new Error(errorMessage);
    }
};
    
/**
 * Fetches a single good by its ID from the API.
 * @param {string} goodsId - The ID of the good to fetch.
 * @returns {Promise<Object>} A promise that resolves to the good object from the 'result' field.
 * @throws {Error} If the API request fails or the response structure is not as expected.
 */
export const getGoodsById = async (goodsId) => {
    if (!API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined.");
        throw new Error("API base URL is not configured.");
    }
    if (!goodsId) {
        console.error("goodsId is required for getGoodsById.");
        throw new Error("Goods ID is required.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/${goodsId}`);
        if (response.data && response.data.code === 1000 && response.data.result) {
            return response.data.result; // Trả về object sản phẩm
        } else {
            const errorMessage = response.data?.message || `Failed to fetch good details for ID: ${goodsId}.`;
            console.error(`Error fetching good by ID ${goodsId}:`, errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error(`API call error to /goods/${goodsId}:`, error.response?.data || error.message || error);
        const errorMessage = error.response?.data?.message || error.message || `An unexpected error occurred while fetching good ID ${goodsId}.`;
        throw new Error(errorMessage);
    }
};

/**
 * Fetches goods by category from the API.
 * @param {string} categoryName - The name of the category.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of goods from the 'result' field.
 * @throws {Error} If the API request fails or the response structure is not as expected.
 */
export const getGoodsByCategoryAPI = async (categoryName) => {
    if (!API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined.");
        throw new Error("API base URL is not configured.");
    }
    if (!categoryName) {
        console.error("categoryName is required for getGoodsByCategoryAPI.");
        throw new Error("Category name is required.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/goodsCategory?goodsCategory=${encodeURIComponent(categoryName)}`);
        // API /goods/goodsCategory trả về ApiResponse<List<GoodsResponse>>
        // nên response.data sẽ là { code: ..., result: [...] }
        if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
            return response.data.result; // Trả về mảng các sản phẩm
        } else {
            const errorMessage = response.data?.message || `Failed to fetch goods for category: ${categoryName} or invalid data structure.`;
            console.error(`Error fetching goods by category ${categoryName}:`, errorMessage, response.data);
            // Trả về mảng rỗng trong trường hợp này để ShopPage không bị crash nếu BE trả về cấu trúc lỗi nhưng không phải lỗi mạng
            if (response.data && response.data.code !== 1000) return [];
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error(`API call error to /goods/goodsCategory?goodsCategory=${categoryName}:`, error.response?.data || error.message || error);
        const errorMessage = error.response?.data?.message || error.message || `An unexpected error occurred while fetching goods by category ${categoryName}.`;
        throw new Error(errorMessage);
    }
};


/**
 * Fetches reviews for a specific good.
 * @param {string} goodsId - The ID of the good.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of review objects.
 * @throws {Error} If the API request fails.
 */
export const getGoodsReviewsAPI = async (goodsId) => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/${goodsId}/reviews`);
        if (response.data && response.data.code === 1000 && response.data.result) {
            return response.data.result;
        } else {
            // Có thể API này trả về mảng rỗng nếu không có review, không phải lỗi
            if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
                return response.data.result; // Trả về mảng rỗng
            }
            const errorMessage = response.data?.message || 'Failed to fetch reviews.';
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred while fetching reviews.');
    }
};

/**
 * Fetches goods details along with its reviews using a single API call.
 * (Sử dụng API này nếu BE của bạn hỗ trợ /goods/details/{goodsId})
 * @param {string} goodsId - The ID of the good.
 * @returns {Promise<Object>} A promise that resolves to an object containing good details and its reviews.
 *                            Example: { goods: {...}, reviews: [...] }
 * @throws {Error} If the API request fails.
 */
export const getGoodsWithReviewsAPI = async (goodsId) => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/details/${goodsId}`);
        // BE Controller /goods/details/{goodsId} trả về ResponseEntity<GoodsDetailsResponse>
        // nên response.data sẽ là GoodsDetailsResponse
        if (response.data && response.data.goods) { // Kiểm tra có goods là được
            return response.data; // { goods: {...}, reviews: [...] }
        } else {
            const errorMessage = response.data?.body || response.data?.message || 'Failed to fetch goods details with reviews.';
            throw new Error(errorMessage);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.body || // BE trả về lỗi qua body() của ResponseEntity
                             error.response?.data?.message ||
                             error.message ||
                             'An unexpected error occurred while fetching goods details with reviews.';
        throw new Error(errorMessage);
    }
};


// (Tùy chọn) Hàm tạo review mới
/**
 * Creates a new review for a good.
 * @param {string} goodsId - The ID of the good to review.
 * @param {Object} reviewData - The review data (e.g., { rating, comment, userId }).
 * @returns {Promise<Object>} A promise that resolves to the created review object.
 * @throws {Error} If the API request fails.
 */
export const createGoodsReviewAPI = async (goodsId, reviewData) => {
    if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
    }
    try {
        // Giả sử người dùng đã đăng nhập, token sẽ được axios interceptor tự động thêm vào (nếu có)
        // Hoặc bạn cần truyền token vào đây nếu không có interceptor
        const response = await axios.post(`${API_BASE_URL}/goods/${goodsId}/reviews`, reviewData);
        // Endpoint này theo GoodsController.java trả về ApiResponse<GoodsReviewResponse>
        if (response.data && response.data.code === 1000 && response.data.result) {
            return response.data.result;
        } else {
            const errorMessage = response.data?.message || 'Failed to create review.';
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred while creating review.');
    }
};