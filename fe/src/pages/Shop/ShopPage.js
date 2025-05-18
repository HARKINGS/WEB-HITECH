import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter/SidebarFilter';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ShopPage.css';
import { FaThLarge, FaList } from 'react-icons/fa';
import { getAllGoods, searchGoodsByNameAPI, getGoodsByCategoryAPI, getGoodsByBrandAPI } from '../../services/goodsService';

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
    const [allFetchedProducts, setAllFetchedProducts] = useState([]);
    const [productsToDisplay, setProductsToDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeFilters, setActiveFilters] = useState({
        searchQuery: '',
        categories: [],
        brands: [],
        priceRange: { min: null, max: null },
        rating: 0,
    });
    const [sortBy, setSortBy] = useState('menu_order');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFilteredItems, setTotalFilteredItems] = useState(0);

    const updateActiveFilters = useCallback((newFilters) => {
        setActiveFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryFromUrl = searchParams.get('query') || '';
        const categoryFromUrl = searchParams.get('category') || '';
        const brandFromUrl = searchParams.get('brand') || '';

        const urlFilters = {};
        if (queryFromUrl) urlFilters.searchQuery = queryFromUrl;
        if (categoryFromUrl) urlFilters.categories = [categoryFromUrl];
        if (brandFromUrl) urlFilters.brands = [brandFromUrl];

        updateActiveFilters(urlFilters);
    }, [location.search, updateActiveFilters]);

    useEffect(() => {
        const fetchDataBasedOnFilters = async () => {
            setLoading(true);
            setError(null);
            let fetchedData = [];

            try {
                if (activeFilters.searchQuery) {
                    fetchedData = await searchGoodsByNameAPI(activeFilters.searchQuery);
                } else if (activeFilters.categories.length > 0) {
                    fetchedData = await getGoodsByCategoryAPI(activeFilters.categories[0]);
                } else if (activeFilters.brands.length > 0) {
                    fetchedData = await getGoodsByBrandAPI(activeFilters.brands[0]);
                } else {
                    fetchedData = await getAllGoods();
                }
                setAllFetchedProducts(fetchedData || []);
            } catch (err) {
                console.error("Error fetching products based on filters:", err);
                setError(err.message || 'Could not load products.');
                setAllFetchedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDataBasedOnFilters();
    }, [activeFilters.searchQuery, activeFilters.categories, activeFilters.brands]);

    const finalProcessedProducts = useMemo(() => {
        let tempProducts = [...allFetchedProducts];

        if (activeFilters.priceRange.min !== null && !isNaN(activeFilters.priceRange.min)) {
            tempProducts = tempProducts.filter(p => p.price >= activeFilters.priceRange.min);
        }
        if (activeFilters.priceRange.max !== null && !isNaN(activeFilters.priceRange.max)) {
            tempProducts = tempProducts.filter(p => p.price <= activeFilters.priceRange.max);
        }

        switch (sortBy) {
            case 'price_asc':
                tempProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                tempProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name_asc':
                tempProducts.sort((a, b) => a.goodsName.localeCompare(b.goodsName));
                break;
            case 'name_desc':
                tempProducts.sort((a, b) => b.goodsName.localeCompare(b.goodsName));
                break;
            case 'menu_order':
            default:
                break;
        }
        return tempProducts;
    }, [allFetchedProducts, activeFilters.priceRange, sortBy]);

    useEffect(() => {
        setTotalFilteredItems(finalProcessedProducts.length);
    }, [finalProcessedProducts]);

    useEffect(() => {
        const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
            return;
        } else if (currentPage < 1 && totalPages > 0) {
            setCurrentPage(1);
            return;
        } else if (totalPages === 0 && totalFilteredItems > 0) {
            setCurrentPage(1);
            return;
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setProductsToDisplay(finalProcessedProducts.slice(startIndex, endIndex));
    }, [finalProcessedProducts, currentPage, totalFilteredItems]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <nav className="shop-pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="page-numbers prev"
                    disabled={currentPage === 1}
                >
                    ← Trước
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`page-numbers ${currentPage === number ? 'current' : ''}`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="page-numbers next"
                    disabled={currentPage === totalPages}
                >
                    Sau →
                </button>
            </nav>
        );
    };

    if (loading && allFetchedProducts.length === 0) {
        return (
            <div className="shop-page dark-theme">
                <div className="container shop-container" style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shop-page dark-theme">
                <div className="container shop-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page dark-theme">
            <div className="shop-header container">
                <div className="breadcrumbs">
                    <Link to="/">Trang chủ</Link> / <span>Cửa hàng {activeFilters.searchQuery && `- Tìm kiếm cho: "${activeFilters.searchQuery}"`}</span>
                </div>
                <h1 className="page-title">Cửa hàng</h1>
            </div>

            <div className="container shop-container">
                <aside className="shop-sidebar">
                    <SidebarFilter onFilterChange={updateActiveFilters} />
                </aside>

                <div className="shop-main-content">
                    <div className="shop-controls">
                        <div className="controls-left">
                            <p className="shop-info">
                                Hiển thị {productsToDisplay.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0}–
                                {Math.min(currentPage * ITEMS_PER_PAGE, totalFilteredItems)} trên {totalFilteredItems} kết quả
                                {activeFilters.searchQuery && ` cho "${activeFilters.searchQuery}"`}
                            </p>
                        </div>
                        <div className="controls-right">
                            <div className="sort-options">
                                <select
                                    name="orderby"
                                    className="orderby"
                                    aria-label="Sắp xếp sản phẩm"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="menu_order">Sắp xếp mặc định</option>
                                    <option value="price_asc">Giá: thấp đến cao</option>
                                    <option value="price_desc">Giá: cao đến thấp</option>
                                    <option value="name_asc">Tên: A-Z</option>
                                    <option value="name_desc">Tên: Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {productsToDisplay.length > 0 ? (
                        <div className="shop-product-grid view-grid">
                            {productsToDisplay.map(product => (
                                <ProductCard key={product.goodsId} product={product} />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <p style={{ textAlign: 'center', padding: '30px' }}>
                                Không tìm thấy sản phẩm nào phù hợp.
                            </p>
                        )
                    )}

                    {renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;