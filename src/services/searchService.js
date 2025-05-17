// src/services/searchService.js  
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Searches for goods by name using the API.
 * @param {string} searchTerm - The search term.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of goods matching the search term.
 * @throws {Error} If the API request fails.
 */
export const searchGoods = async (searchTerm) => {
    if (!API_BASE_URL) {
        console.error("REACT_APP_API_BASE_URL is not defined.");
        throw new Error("API base URL is not configured.");
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/goods/goodsName?goodsName=${searchTerm}`);

        if (response.data && response.data.code === 1000 && response.data.result) {
            return response.data.result; // Trả về mảng các sản phẩm
        } else {
            const errorMessage = response.data?.message || 'Failed to fetch search results or invalid data structure.';
            console.error('Error fetching search results:', errorMessage, response.data);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('API call error to /goods/goodsName:', error.response || error.message || error);
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred while searching.';
        throw new Error(errorMessage);
    }
};