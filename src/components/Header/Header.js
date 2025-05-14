// Merged Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import {
    FaSearch,
    FaUser, // Kept for potential future use (commented out in JSX)
    FaShoppingCart,
    FaBars,
    FaChevronDown,
    FaStar,
    FaRegStar,
    FaTimes,
    FaPlus,
    FaMinus
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext'; // Assuming this path is correct

// Mock data for dropdowns (Taken from File 2 as it was more complete)
const browseCategoriesData = [
    { name: 'Cửa hàng', link: '/shop'},
    { name: 'TV & Speaker', link: '#' },
    { name: 'Smart Devices', link: '#', subItems: true },
    { name: 'Chargers & Cables', link: '#' },
    { name: 'Laptop & Computers', link: '#' },
    { name: 'Phones', link: '#', subItems: true }, // From File 2
    { name: 'Cameras', link: '#' },
    { name: 'Smart Watches', link: '#' },
    { name: 'Earbuds Bose', link: '#' },
    { name: 'Android TV', link: '#' },
];

// Basic star rendering function (From File 1 - more robust)
const renderStars = (rating) => {
    const stars = [];
    const validRating = typeof rating === 'number' ? rating : 0;
    const fullStars = Math.floor(validRating);
    // const hasHalfStar = validRating % 1 !== 0; // For future half-star logic

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<FaStar key={`f-${i}`} className="star-icon filled" />);
        } else {
            stars.push(<FaRegStar key={`e-${i}`} className="star-icon empty" />);
        }
    }
    return stars;
};


const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { cartItems, cartItemCount, removeFromCart, cartTotal, updateQuantity } = useCart();
    const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
    const leaveTimeoutRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCartItemCount = useRef(cartItemCount);
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For future mobile menu

    useEffect(() => {
        if (cartItemCount > prevCartItemCount.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);
            return () => clearTimeout(timer);
        }
        prevCartItemCount.current = cartItemCount;
    }, [cartItemCount]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
        // Implement search logic or navigation
    };

    const handleCartMouseEnter = () => {
        clearTimeout(leaveTimeoutRef.current);
        setIsCartPreviewOpen(true);
    };

    const handleCartMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => {
            setIsCartPreviewOpen(false);
        }, 200);
    };

    // Function to render a simple list dropdown (Identical in both, kept one)
    const renderSimpleDropdown = (items) => (
        <ul className="dropdown-list">
            {items.map((item, index) => (
                <li key={index}>
                    <Link to={item.link}>{item.name}
                      {item.badge && <span className={`badge badge-${item.badge.type}`}>{item.badge.text}</span>}
                    </Link>
                </li>
            ))}
        </ul>
    );

     // Function to render category style dropdown (Generic version from File 1)
     // File 2 had a "Best selling" section hardcoded here.
     // It's better to pass specific sections as data or compose them where this function is called.
     const renderCategoryDropdown = (columns) => (
        <div className="mega-menu-grid category-style-grid">
            {columns.map((col, colIndex) => (
                <div className="mega-menu-column" key={colIndex}>
                    <h4>{col.title}</h4>
                    <ul>
                        {col.items.map((item, itemIndex) => (
                            <li key={itemIndex}><Link to={item.link}>{item.name}</Link></li>
                        ))}
                    </ul>
                </div>
            ))}
            {/* Example of adding a best-selling section (as seen in File 2, but outside the generic renderer) */}
            {/*
            <div className="mega-menu-column best-selling">
                <h4>Best selling</h4>
                <div className="product-showcase-mini">
                    <img src="/assets/images/washing-machine.jpg" alt="Product"/>
                    <div>
                        <Link to="/products/2">12KG Front Load Washing Machine With Inverter</Link>
                        <span className="price">$210</span>
                    </div>
                </div>
                 <div className="product-showcase-mini">
                    <img src="/assets/images/apple-watch-se.jpg" alt="Product"/>
                    <div>
                        <Link to="/products/6">Apple Watch SE 44mm GPS+Cellular Gold</Link>
                        <span className="price">$35 - $45</span>
                    </div>
                </div>
            </div>
            */}
        </div>
    );

    // Function to render product style dropdown (From File 1 - safer image paths and price)
    const renderProductDropdown = (title, products) => (
         <div className="product-style-grid">
            {title && <h4>{title}</h4>}
            <div className="product-grid-mini">
             {products.map(product => (
                 <div className="product-card-mini" key={product.id}>
                    <Link to={`/products/${product.id}`} className="product-image-link-mini">
                       <img src={product.imageUrl || '/assets/images/placeholder-image.png'} alt={product.name} />
                       {product.salePercent && <span className="badge badge-sale">-{product.salePercent}%</span>}
                    </Link>
                    <div className="product-info-mini">
                       <h5 className="product-name-mini">
                           <Link to={`/products/${product.id}`}>{product.name}</Link>
                       </h5>
                       <div className="product-rating-mini">{renderStars(product.rating)}</div>
                       <div className="product-price-mini">
                          <span className="current-price">${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</span>
                          {product.oldPrice && <span className="old-price">${typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : '0.00'}</span>}
                       </div>
                    </div>
                 </div>
             ))}
            </div>
        </div>
    );

     // Function to render "Shop By" style dropdown (From File 1 - safer image paths and price)
     const renderShopByDropdown = (categories, topRated) => (
        <div className="mega-menu-grid shop-by-grid">
            <div className="mega-menu-column shop-by-categories">
                <h4>Shop By</h4>
                <div className="category-icons-grid">
                    {categories.map((cat, index) => (
                         <Link to={cat.link} key={index} className="category-icon-item">
                            <img src={cat.iconUrl || '/assets/images/placeholder-category.png'} alt={cat.name}/>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mega-menu-column top-rated-products">
                 <h4>Top Rated</h4>
                 {topRated.map((prod, index) => (
                    <div className="product-showcase-mini horizontal" key={index}>
                       <img src={prod.imageUrl || '/assets/images/placeholder-image.png'} alt={prod.name}/>
                        <div>
                           <Link to={`/products/${prod.id}`}>{prod.name}</Link>
                           <span className="price">${prod.priceRange || (typeof prod.price === 'number' ? prod.price.toFixed(2) : '0.00')}</span>
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    );

    // Cart Preview Render Function (From File 1)
    const renderCartPreview = () => (
        <div
            className="cart-preview-dropdown"
            onMouseEnter={handleCartMouseEnter}
            onMouseLeave={handleCartMouseLeave}
        >
            {cartItems.length === 0 ? (
                <p className="cart-preview-empty">Giỏ hàng của bạn đang trống!</p>
            ) : (
                <>
                    <ul className="cart-preview-list">
                        {cartItems.map(item => (
                            <li key={item.id} className="cart-preview-item">
                                <img
                                    src={item.imageUrl || '/assets/images/placeholder-image.png'}
                                    alt={item.name}
                                    className="cart-preview-image"
                                />
                                <div className="cart-preview-info">
                                    <Link
                                        to={`/products/${item.id}`}
                                        className="cart-preview-name"
                                        onClick={() => setIsCartPreviewOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="cart-preview-quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="quantity-btn decrease-btn"
                                            aria-label="Decrease quantity"
                                            disabled={item.quantity <= 1}
                                        >
                                            <FaMinus size={10}/>
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="quantity-btn increase-btn"
                                            aria-label="Increase quantity"
                                        >
                                            <FaPlus size={10}/>
                                        </button>
                                    </div>
                                    <span className="cart-preview-price">
                                        <strong>${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}/1 sản phẩm</strong>
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="cart-preview-remove"
                                    aria-label={`Remove ${item.name} from cart`}
                                >
                                    <FaTimes size={12}/>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-preview-summary">
                        <span>Tổng:</span>
                        <span className="cart-preview-total">${typeof cartTotal === 'number' ? cartTotal.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="cart-preview-actions">
                        <Link
                            to="/checkout"
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsCartPreviewOpen(false)}
                         >
                            Thanh toán
                        </Link>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <header className="site-header">
            {/* Top Bar (Example from File 2, commented out) */}
            {/*
            <div className="header-top">
                 <div className="container header-top-inner">
                    <div className="header-message noselect">
                        Tell a friends about Electech Electronics & get 30% off your next order.
                    </div>
                    <nav className="header-top-nav">
                        <Link to="/about-us">About Us</Link>
                        <Link to="/contact-us">Contact Us</Link>
                    </nav>
                 </div>
            </div>
            */}

            {/* Main Header */}
            <div className="header-main">
                <div className="container header-main-inner">
                     <div className="logo">
                         <Link to="/">
                             <span className="logo-text noselect">electech</span>
                         </Link>
                     </div>
                     <form className="search-form" onSubmit={handleSearch}>
                         <input
                             type="text"
                             placeholder="Search products..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             className="search-input"
                         />
                         <button type="submit" className="search-button">
                             <FaSearch />
                         </button>
                     </form>
                      <div className="header-actions">
                         <div
                             className="header-action-item cart-action-wrapper"
                             onMouseEnter={handleCartMouseEnter}
                             onMouseLeave={handleCartMouseLeave}
                          >
                             <Link to="/cart" className={`cart-link-icon ${isAnimating ? 'cart-shake' : ''}`}>
                                 <FaShoppingCart />
                                 <span className="noselect">
                                     Giỏ hàng <span className="cart-count">{cartItemCount}</span>
                                 </span>
                             </Link>
                              {isCartPreviewOpen && renderCartPreview()}
                         </div>
                          {/* <Link to="/account" className="header-action-item">
                             <FaUser />
                             <span className="noselect">Account</span>
                          </Link> */}
                     </div>
                 </div>
            </div>

            {/* Navigation Bar */}
            <div className="header-nav">
                 <div className="container header-nav-inner">
                    <div className="nav-item has-dropdown browse-categories-wrapper">
                        <div className="browse-categories noselect">
                            <FaBars />
                            <span>Danh mục sản phẩm</span>
                        </div>
                        <div className="dropdown-menu browse-menu">
                            <ul className="dropdown-list vertical-list">
                                {browseCategoriesData.map((item, index) => ( // Using merged browseCategoriesData
                                    <li key={index}>
                                        <Link to={item.link}>
                                            {item.name}
                                            {item.subItems && <FaChevronDown className="submenu-arrow" size={10}/>}
                                         </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <nav className="main-navigation">
                        <div className="nav-item">
                          <Link to="/">Trang chủ</Link>
                        </div>

                        <div className="nav-item has-dropdown">
                            <Link to="/shop">Cửa hàng <FaChevronDown size={10} /></Link>
                            <div className="dropdown-menu mega-menu shop-menu">
                                {/* Using more extensive item list from File 2 */}
                                {renderCategoryDropdown([
                                    { title: 'Product Types', items: [
                                        { name: 'Simple Product', link: '#'},
                                        { name: 'Grouped Product', link: '#'},
                                        { name: 'Variable Product', link: '#'},
                                        { name: 'External/Affiliate Product', link: '#'},
                                        { name: 'Sale Product', link: '#'},
                                        { name: 'Upsell Products', link: '#'},
                                        { name: 'Cross-Sell Product', link: '#'},
                                    ]},
                                    { title: 'WooCommerce Pages', items: [
                                        { name: 'Shop Page', link: '/shop'},
                                        { name: 'Checkout Page', link: '/checkout'},
                                        { name: 'Shopping Cart', link: '/cart'},
                                        { name: 'Shop Ajax Filter', link: '#'},
                                        { name: 'Product Category', link: '#'},
                                        { name: 'Privacy Policy', link: '#'},
                                    ]},
                                    { title: 'Product Features', items: [
                                         { name: 'Stock Progress Bar', link: '#'},
                                         { name: 'Color/Image Swatches', link: '#'},
                                         { name: 'Sticky Add To Cart', link: '#'},
                                         { name: 'Custom Tab', link: '#'},
                                         { name: 'Countdown Timer', link: '#'},
                                         { name: 'Product Video', link: '#'},
                                         { name: 'Product Brand', link: '#'},
                                    ]},
                                ])}
                                {/* Optional Ad Section (from File 2, commented out) */}
                                {/*
                                <div className="mega-menu-column image-ad">
                                    <img src="/assets/images/vr-box-ad.png" alt="Special Sale VR Box"/>
                                    <div className="ad-content">
                                        <span>SPECIAL SALE!</span>
                                        <h4>Up to 30% OFF</h4>
                                        <Link to="#" className="btn-shop-now">SHOP NOW</Link>
                                    </div>
                                </div>
                                */}
                            </div>
                        </div>

                         <div className="nav-item has-dropdown">
                             <Link to="#">Sản phẩm <FaChevronDown size={10} /></Link>
                             <div className="dropdown-menu mega-menu categories-menu">
                                 {/* Using more extensive item list from File 2 */}
                                 {renderCategoryDropdown([
                                     { title: 'Cameras', items: [ { name: 'Backup camera', link: '#'}, { name: 'Digital Camera', link: '#'}, { name: 'DSLR Cameras', link: '#'}, { name: 'Movie camera', link: '#'} ]},
                                     { title: 'Phones', items: [ { name: 'Basic Phones', link: '#'}, { name: 'Feature Phones', link: '#'}, { name: 'Smartphones', link: '#'} ]},
                                     { title: 'TV & Speaker', items: [ { name: 'Android TV', link: '#'}, { name: 'Control Speakers', link: '#'}, { name: 'Bluetooth Speakers', link: '#'}, { name: 'Game Controller', link: '#'} ]},
                                     { title: 'Smart Devices', items: [ { name: 'Android Tablet', link: '#'}, { name: 'Digital Watches', link: '#'}, { name: 'Smart Locks', link: '#'}, { name: 'Smart Watches', link: '#'} ]},
                                     { title: 'Laptop & Computers', items: [ { name: 'Convertible Laptops', link: '#'}, { name: 'Gaming Laptops', link: '#'}, { name: 'Ultraportable Laptops', link: '#'} ]},
                                     { title: 'Chargers & Cables', items: [ { name: 'Adapter Plug', link: '#'}, { name: 'Bettery Chargers', link: '#'}, { name: 'USB Cables', link: '#'}, { name: 'USB Type Cable', link: '#'} ]},
                                 ])}
                             </div>
                         </div>

                        {/* Optional: Top Deals Dropdown (Commented out structure) */}
                        {/*
                        <div className="nav-item has-dropdown">
                             <Link to="#">Top Deals <FaChevronDown size={10} /></Link>
                              <div className="dropdown-menu mega-menu top-deals-menu">
                                 {/* Content for Top Deals menu (e.g., using renderProductDropdown)
                            </div>
                        </div>
                        */}

                         <div className="nav-item has-dropdown">
                             <Link to="#">Khác <FaChevronDown size={10} /></Link>
                             <div className="dropdown-menu elements-menu">
                                 {renderSimpleDropdown([
                                     { name: 'Liên hệ chúng tôi', link: '/contact-us' },
                                     { name: 'Chính sách', link: '/policy'}
                                 ])}
                             </div>
                         </div>
                    </nav>

                    {/* Optional: Today's Deals Link (Commented out) */}
                    {/*
                    <div className="todays-deals">
                         <Link to="/shop?filter=today">
                             <span className="icon-placeholder"></span> {/* Replace with actual icon
                             <span className="noselect">Today's Deals</span>
                         </Link>
                    </div>
                    */}
                </div>
            </div>
        </header>
    );
};

export default Header;