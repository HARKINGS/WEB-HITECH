// src/pages/Shop/ShopPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import SidebarFilter from '../../components/SidebarFilter/SidebarFilter';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ShopPage.css';
import { FaThLarge, FaList } from 'react-icons/fa';

// Assuming getGoodsByCategoryAPI is the correct name in your service
import { getAllGoods, getGoodsByCategoryAPI } from '../../services/goodsService';
import { searchGoods } from '../../services/searchService';
// It would be ideal to have an API for just categories:
// import { getAllCategoriesAPI } from '../../services/categoryService';

const ShopPage = () => {
    const [initialProducts, setInitialProducts] = useState([]); // Products loaded based on URL (all, search, or category)
    const [filteredProducts, setFilteredProducts] = useState([]); // Products after client-side filtering
    const [allCategories, setAllCategories] = useState([]); // Categories for the sidebar
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate(); // For updating URL with category filter
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');
    const categoryQuery = searchParams.get('category'); // From URL

    // State for filters selected in SidebarFilter
    const [activeClientFilters, setActiveClientFilters] = useState({
        priceRange: { min: null, max: null },
        // 'categories' from sidebar will be handled differently, it should navigate
    });

    // Effect 1: Fetch initial products based on URL (search or category) and all categories for sidebar
    useEffect(() => {
        const fetchBaseData = async () => {
            setLoading(true);
            setError(null);
            try {
                let productDataPromise;
                if (searchQuery && searchQuery.trim() !== '') {
                    console.log(`ShopPage: Searching for "${searchQuery}"`);
                    productDataPromise = searchGoods(searchQuery);
                } else if (categoryQuery && categoryQuery.trim() !== '') {
                    console.log(`ShopPage: Fetching goods for category "${categoryQuery}"`);
                    productDataPromise = getGoodsByCategoryAPI(categoryQuery);
                } else {
                    console.log("ShopPage: Fetching all goods");
                    productDataPromise = getAllGoods();
                }

                // Fetch categories (ideal: dedicated API, fallback: from all products)
                // This could be optimized to run in parallel with productDataPromise
                // For now, fetch all products if categories aren't loaded yet or it's a general shop page
                let categoriesData = [];
                if (allCategories.length === 0) {
                    // IDEAL: const categoriesResponse = await getAllCategoriesAPI();
                    // IDEAL: categoriesData = categoriesResponse.result || categoriesResponse;
                    // FALLBACK:
                    const allGoodsResponse = await getAllGoods(); // Fetch all goods for category list
                    const allProds = (allGoodsResponse && Array.isArray(allGoodsResponse.result)) ? allGoodsResponse.result : (Array.isArray(allGoodsResponse) ? allGoodsResponse : []);
                    const uniqueCategories = new Set(allProds.map(p => p.goodsCategory).filter(Boolean));
                    categoriesData = Array.from(uniqueCategories).sort();
                    setAllCategories(categoriesData);
                }


                const productResponse = await productDataPromise;
                const products = (productResponse && Array.isArray(productResponse.result)) ? productResponse.result : (Array.isArray(productResponse) ? productResponse : []);

                setInitialProducts(products);
                // setFilteredProducts(products); // Initially, filtered is same as initial

            } catch (err) {
                console.error("Failed to fetch initial data for ShopPage:", err);
                setError(err.message || 'Could not load products. Please try again later.');
                setInitialProducts([]);
                // setFilteredProducts([]);
                // setAllCategories([]); // Potentially clear categories on error too
            } finally {
                setLoading(false);
            }
        };

        fetchBaseData();
    }, [searchQuery, categoryQuery]); // Rerun if URL search/category query changes

    // Callback from SidebarFilter for client-side filters (like price)
    // For category selection from sidebar, we'll navigate instead of client-side filtering here
    const handleClientFilterChange = (newFilters) => {
        console.log("Client-side filters received in ShopPage:", newFilters);
        // If a category is selected in the sidebar, navigate to that category URL
        if (newFilters.categories && newFilters.categories.length > 0) {
            // Assuming only one category can be selected at a time from sidebar for navigation
            const selectedCat = newFilters.categories[0];
            if (selectedCat && selectedCat !== categoryQuery) {
                 // Clear search query if navigating by category
                navigate(`/shop?category=${encodeURIComponent(selectedCat)}`);
                return; // Navigation will trigger useEffect to refetch
            }
        }
        // For other filters like price, update activeClientFilters
        setActiveClientFilters(prev => ({
            ...prev,
            priceRange: newFilters.priceRange || { min: null, max: null },
            // Add other client-side filter types here
        }));
    };


    // Effect 2: Apply client-side filters whenever initialProducts or activeClientFilters change
    useEffect(() => {
        if (!initialProducts) {
            setFilteredProducts([]);
            return;
        }

        let tempProducts = [...initialProducts];

        // Client-side filter by price range
        const { min, max } = activeClientFilters.priceRange;
        if (min !== null && min !== undefined && min !== '') {
            tempProducts = tempProducts.filter(product => Number(product.price) >= Number(min));
        }
        if (max !== null && max !== undefined && max !== '') {
            tempProducts = tempProducts.filter(product => Number(product.price) <= Number(max));
        }

        // Add other client-side filtering logic here (e.g., rating, color IF these are not server-side)

        setFilteredProducts(tempProducts);
    }, [initialProducts, activeClientFilters]);


    const productsToDisplay = filteredProducts;
    const totalProducts = productsToDisplay.length;

    let pageTitle = "Cửa hàng";
    let breadcrumbCategoryName = categoryQuery; // For breadcrumbs

    if (searchQuery) {
        pageTitle = `Kết quả tìm kiếm cho "${searchQuery}"`;
    } else if (categoryQuery) {
        // If you have a mapping of category slugs to display names, use it here
        // For now, just use the query
        pageTitle = `Danh mục: ${breadcrumbCategoryName}`;
    }

    const breadcrumbPath = (
        <>
            <Link to="/">Trang chủ</Link> /
            { (searchQuery || categoryQuery) ? <Link to="/shop"> Cửa hàng</Link> : <span> Cửa hàng</span> }
            { categoryQuery && !searchQuery && <span> / {breadcrumbCategoryName}</span>}
            { searchQuery && <span> / Kết quả tìm kiếm</span>}
        </>
    );


    if (loading && initialProducts.length === 0) { // Show initial loading
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
                     <Link to="/shop" className="btn btn-primary">Thử lại</Link>
                 </div>
            </div>
        );
    }

    return (
        <div className="shop-page dark-theme">
            <div className="shop-header container">
                <div className="breadcrumbs">
                    {breadcrumbPath}
                </div>
                <h1 className="page-title">{pageTitle}</h1>
            </div>

            <div className="container shop-container">
                <aside className="shop-sidebar">
                    {/* Pass availableCategories and the handler */}
                    <SidebarFilter
                        onFilterChange={handleClientFilterChange}
                        availableCategories={allCategories} // Pass the fetched categories
                        currentCategory={categoryQuery} // Pass current category from URL to highlight in sidebar
                    />
                </aside>

                <main className="shop-main-content">
                    <div className="shop-controls">
                        <div className="controls-left">
                            <p className="shop-info">
                                {loading ? 'Đang cập nhật...' :
                                 (totalProducts > 0
                                    ? `Tìm thấy ${totalProducts} sản phẩm.`
                                    : `Không tìm thấy sản phẩm nào${searchQuery ? ` khớp với "${searchQuery}"` : ''}${categoryQuery ? ` trong danh mục "${categoryQuery}"` : ''}.`)}
                            </p>
                        </div>
                        <div className="controls-right">
                            <div className="sort-options">
                                <select name="orderby" className="orderby" aria-label="Sắp xếp sản phẩm">
                                    <option value="menu_order">Sắp xếp mặc định</option>
                                    {/* Add sorting options later */}
                                </select>
                            </div>
                            <div className="view-options">
                                <button className="view-btn grid active" title="Grid view"><FaThLarge /></button>
                                <button className="view-btn list" title="List view"><FaList /></button>
                            </div>
                        </div>
                    </div>

                    {/* Show loading indicator during client-side filtering if desired, though it should be fast */}
                    {/* {isApplyingFilters && <p>Applying filters...</p>} */}

                    {!loading && productsToDisplay.length > 0 ? (
                        <div className="shop-product-grid view-grid">
                            {productsToDisplay.map(product => (
                                <ProductCard
                                    key={product.goodsId || product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="no-products-found">
                                <p>
                                    Không tìm thấy sản phẩm nào
                                    {searchQuery ? ` khớp với tìm kiếm "${searchQuery}"` : ''}
                                    {categoryQuery ? ` trong danh mục "${categoryQuery}"` : ''}
                                    {(activeClientFilters.priceRange.min || activeClientFilters.priceRange.max) ? ' theo bộ lọc giá hiện tại' : ''}.
                                </p>
                                {(!searchQuery && !categoryQuery) && <p><Link to="/shop">Xem tất cả sản phẩm.</Link></p>}
                            </div>
                        )
                    )}
                    {totalProducts > 0 && (
                        <nav className="shop-pagination">
                            <span className="page-numbers current">1</span>
                            {/* Implement actual pagination later */}
                        </nav>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopPage;