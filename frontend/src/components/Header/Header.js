import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaChevronDown, FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth'; // Add this import

// Mock data for dropdowns (replace with real data later)
const browseCategoriesData = [
    { name: 'Our Store', link: '/shop' },
    { name: 'TV & Speaker', link: '#' },
    { name: 'Smart Devices', link: '#', subItems: true },
    { name: 'Chargers & Cables', link: '#' },
    { name: 'Laptop & Computers', link: '#' },
    // { name: 'Phones', link: '#', subItems: true },
];

// Basic star rendering function (if needed in menus)
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
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
    const { isAuthenticated, user, logout } = useAuth(); // Get auth state

    // State for mobile menu toggle (add later if needed)
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
        // Navigate to search results page or implement search logic
    };

    // Function to handle logout
    const handleLogout = () => {
        logout();
    };

    // Function to render a simple list dropdown
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

    // Function to render category style dropdown
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
            {/* Optional: Add best selling section */}
            <div className="mega-menu-column best-selling">
                <h4>Best selling</h4>
                {/* Add Product showcase here */}
                <div className="product-showcase-mini">
                    <img src="/assets/images/washing-machine.jpg" alt="Product" />
                    <div>
                        <Link to="/products/2">12KG Front Load Washing Machine With Inverter</Link>
                        <span className="price">$210</span>
                    </div>
                </div>
                <div className="product-showcase-mini">
                    <img src="/assets/images/apple-watch-se.jpg" alt="Product" />
                    <div>
                        <Link to="/products/6">Apple Watch SE 44mm GPS+Cellular Gold</Link>
                        <span className="price">$35 - $45</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Function to render product style dropdown
    const renderProductDropdown = (title, products) => (
        <div className="product-style-grid">
            {title && <h4>{title}</h4>}
            <div className="product-grid-mini">
                {products.map(product => (
                    <div className="product-card-mini" key={product.id}>
                        <Link to={`/products/${product.id}`} className="product-image-link-mini">
                            <img src={product.imageUrl || '/path/to/placeholder.jpg'} alt={product.name} />
                            {product.salePercent && <span className="badge badge-sale">-{product.salePercent}%</span>}
                        </Link>
                        <div className="product-info-mini">
                            <h5 className="product-name-mini">
                                <Link to={`/products/${product.id}`}>{product.name}</Link>
                            </h5>
                            <div className="product-rating-mini">{renderStars(product.rating)}</div>
                            <div className="product-price-mini">
                                <span className="current-price">${product.price.toFixed(2)}</span>
                                {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Function to render "Shop By" style dropdown
    const renderShopByDropdown = (categories, topRated) => (
        <div className="mega-menu-grid shop-by-grid">
            <div className="mega-menu-column shop-by-categories">
                <h4>Shop By</h4>
                <div className="category-icons-grid">
                    {categories.map((cat, index) => (
                        <Link to={cat.link} key={index} className="category-icon-item">
                            <img src={cat.iconUrl} alt={cat.name} />
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mega-menu-column top-rated-products">
                <h4>Top Rated</h4>
                {/* Add Product showcase here */}
                {topRated.map((prod, index) => (
                    <div className="product-showcase-mini horizontal" key={index}>
                        <img src={prod.imageUrl} alt={prod.name} />
                        <div>
                            <Link to={`/products/${prod.id}`}>{prod.name}</Link>
                            <span className="price">${prod.priceRange || prod.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <header className="site-header">
            {/* Top Bar */}
            <div className="header-top">
                {/* ... (Top bar content remains the same) ... */}
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

            {/* Main Header */}
            <div className="header-main">
                {/* ... (Logo, Search, Actions remain the same structure) ... */}
                <div className="container header-main-inner">
                    <div className="logo">
                        <Link to="/">
                            <span className="logo-text noselect">electech</span>
                        </Link>
                    </div>
                    <form className="search-form" onSubmit={handleSearch}>
                        {/* ... search form elements ... */}
                        <div className="search-category-dropdown noselect">
                            <span>All Categories</span> <FaChevronDown size={12} />
                            {/* Dropdown content here if needed */}
                        </div>
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
                        <Link to="/cart" className="header-action-item">
                            <FaShoppingCart />
                            <span className="noselect">
                                My Cart <span className="cart-count">0</span> Items
                            </span>
                        </Link>
                        {/* Display different options based on authentication status */}
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="header-action-item">
                                    <FaUser />
                                    <span className="noselect">
                                        {user?.name || 'My Account'}
                                    </span>
                                </Link>
                                <button onClick={handleLogout} className="header-action-item logout-button">
                                    <span className="noselect">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="header-auth-links">
                                <Link to="/login" className="header-action-item">
                                    <FaUser />
                                    <span className="noselect">Login</span>
                                </Link>
                                <Link to="/register" className="header-action-item">
                                    <span className="noselect">Register</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="header-nav">
                <div className="container header-nav-inner">
                    {/* Browse All Categories Dropdown */}
                    <div className="nav-item has-dropdown browse-categories-wrapper">
                        <div className="browse-categories noselect">
                            <FaBars />
                            <span>Browse All Categories</span>
                        </div>
                        <div className="dropdown-menu browse-menu">
                            <ul className="dropdown-list vertical-list">
                                {browseCategoriesData.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>
                                            {item.name}
                                            {item.subItems && <FaChevronDown className="submenu-arrow" size={10} />}
                                        </Link>
                                        {/* Add logic for potential sub-sub-menus here if needed */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <nav className="main-navigation">
                        {/* Home Link (No Dropdown) */}
                        <div className="nav-item">
                            <Link to="/">Home</Link>
                        </div>

                        {/* Shop Dropdown */}
                        <div className="nav-item has-dropdown">
                            <Link to="/shop">Shop <FaChevronDown size={10} /></Link>
                            <div className="dropdown-menu mega-menu shop-menu">
                                {renderCategoryDropdown([
                                    {
                                        title: 'Product Types', items: [
                                            { name: 'Simple Product', link: '#' },
                                            { name: 'Grouped Product', link: '#' },
                                            { name: 'Variable Product', link: '#' },
                                            { name: 'External/Affiliate Product', link: '#' },
                                            { name: 'Sale Product', link: '#' },
                                            { name: 'Upsell Products', link: '#' },
                                            { name: 'Cross-Sell Product', link: '#' },
                                        ]
                                    },
                                    {
                                        title: 'WooCommerce Pages', items: [
                                            { name: 'Shop Page', link: '/shop' },
                                            { name: 'Checkout Page', link: '/checkout' },
                                            { name: 'Shopping Cart', link: '/cart' },
                                            { name: 'My Account', link: '/account' },
                                            { name: 'Shop Ajax Filter', link: '#' },
                                            { name: 'Product Category', link: '#' },
                                            { name: 'Privacy Policy', link: '#' },
                                        ]
                                    },
                                    {
                                        title: 'Product Features', items: [
                                            { name: 'Stock Progress Bar', link: '#' },
                                            { name: 'Color/Image Swatches', link: '#' },
                                            { name: 'Sticky Add To Cart', link: '#' },
                                            { name: 'Custom Tab', link: '#' },
                                            { name: 'Countdown Timer', link: '#' },
                                            { name: 'Product Video', link: '#' },
                                            { name: 'Product Brand', link: '#' },
                                        ]
                                    },
                                ])}
                                {/* Image Ad Section */}
                                {/* <div className="mega-menu-column image-ad">
                                    <img src="/assets/images/vr-box-ad.png" alt="Special Sale VR Box"/>
                                    <div className="ad-content">
                                        <span>SPECIAL SALE!</span>
                                        <h4>Up to 30% OFF</h4>
                                        <Link to="#" className="btn-shop-now">SHOP NOW</Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* Categories Dropdown */}
                        <div className="nav-item has-dropdown">
                            <Link to="#">Categories  <FaChevronDown size={10} /></Link>
                            <div className="dropdown-menu mega-menu categories-menu">
                                {renderCategoryDropdown([
                                    { title: 'Cameras', items: [{ name: 'Backup camera', link: '#' }, { name: 'Digital Camera', link: '#' }, /*...*/ { name: 'Movie camera', link: '#' }] },
                                    { title: 'Phones', items: [{ name: 'Basic Phones', link: '#' }, { name: 'Feature Phones', link: '#' }, /*...*/ { name: 'Smart Phones', link: '#' }] },
                                    { title: 'TV & Speaker', items: [{ name: 'Android TV', link: '#' }, { name: 'Control Speakers', link: '#' }, /*...*/ { name: 'Game Controller', link: '#' }] },
                                    { title: 'Smart Devices', items: [{ name: 'Android Tablet', link: '#' }, { name: 'Digital Watches', link: '#' }, /*...*/ { name: 'Smart Watches', link: '#' }] },
                                    { title: 'Laptop & Computers', items: [{ name: 'Android Tablet', link: '#' }, { name: 'Convertible Laptops', link: '#' }, /*...*/ { name: 'Ultraportable Laptops', link: '#' }] },
                                    { title: 'Chargers & Cables', items: [{ name: 'Adapter Plug', link: '#' }, { name: 'Bettery Chargers', link: '#' }, /*...*/ { name: 'USB Type Cable', link: '#' }] },
                                ])}
                            </div>
                        </div>
                        {/* Top Deals Dropdown */}
                        {/* <div className="nav-item has-dropdown">
                             <Link to="#">Top Deals <FaChevronDown size={10} /></Link>
                              <div className="dropdown-menu mega-menu top-deals-menu">

                            </div>
                        </div> */}

                        {/* Elements Dropdown */}
                        <div className="nav-item has-dropdown">
                            <Link to="#">Elements <FaChevronDown size={10} /></Link>
                            <div className="dropdown-menu elements-menu">
                                {renderSimpleDropdown([
                                    //  { name: 'FAQs', link: '#', badge: { type: 'ask', text: 'ASK' } }, // Example badge
                                    { name: 'About Us', link: '#' },
                                    { name: 'Contact Us', link: '#' },
                                ])}
                            </div>
                        </div>

                    </nav>

                    {/* <div className="todays-deals">
                         <Link to="/shop?filter=today">
                             <span className="icon-placeholder"></span> 
                             <span className="noselect">Today's Deals</span>
                         </Link>
                    </div> */}
                </div>
            </div>
        </header>
    );
};

export default Header;