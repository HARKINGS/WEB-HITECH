// // src/components/Header/Header.js
// import React, { useState, useRef, useEffect } from 'react';
// import { NavLink, Link, useNavigate, createSearchParams } from 'react-router-dom';
// import './Header.css';
// import {
//     FaSearch, FaShoppingCart, FaTimes, FaPlus, FaMinus
// } from 'react-icons/fa';
// import { useCart } from '../../contexts/CartContext';

// const Header = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const { cartItems, cartItemCount, removeFromCart, cartTotal, updateQuantity } = useCart();
//     const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
//     const leaveTimeoutRef = useRef(null);
//     const [isAnimating, setIsAnimating] = useState(false);
//     const prevCartItemCount = useRef(cartItemCount);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (cartItemCount > prevCartItemCount.current) {
//             setIsAnimating(true);
//             const timer = setTimeout(() => setIsAnimating(false), 300);
//             return () => clearTimeout(timer);
//         }
//         prevCartItemCount.current = cartItemCount;
//     }, [cartItemCount]);

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!searchTerm.trim()) {
//             console.warn("Search term is empty.");
//             return;
//         }
//         try {
//             const searchParams = createSearchParams({ query: searchTerm });
//             navigate({
//                 pathname: '/shop',
//                 search: searchParams.toString()
//             });
//             setSearchTerm('');
//         } catch (error) {
//             console.error('Search error:', error);
//         }
//     };

//     const handleCartMouseEnter = () => {
//         clearTimeout(leaveTimeoutRef.current);
//         setIsCartPreviewOpen(true);
//     };
    
//     const handleCartMouseLeave = () => {
//         leaveTimeoutRef.current = setTimeout(() => {
//             setIsCartPreviewOpen(false);
//         }, 200);
//     };

//     const renderCartPreview = () => {
//         return (
//             <div
//                 className="cart-preview-dropdown"
//                 onMouseEnter={handleCartMouseEnter}
//                 onMouseLeave={handleCartMouseLeave}
//             >
//                 {cartItems.length === 0 ? (
//                     <p className="cart-preview-empty">Giỏ hàng của bạn đang trống!</p>
//                 ) : (
//                     <>
//                         <ul className="cart-preview-list">
//                             {cartItems.map(item => (
//                                 <li key={item.id} className="cart-preview-item">
//                                     <img
//                                         src={item.imageUrl || '/assets/images/placeholder-image.png'}
//                                         alt={item.name}
//                                         className="cart-preview-image"
//                                     />
//                                     <div className="cart-preview-info">
//                                         <Link
//                                             to={`/products/${item.id}`}
//                                             className="cart-preview-name"
//                                             onClick={() => setIsCartPreviewOpen(false)}
//                                         >
//                                             {item.name}
//                                         </Link>
//                                         <div className="cart-preview-quantity-controls">
//                                             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="quantity-btn"><FaMinus size={10}/></button>
//                                             <span className="quantity-display">{item.quantity}</span>
//                                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn"><FaPlus size={10}/></button>
//                                         </div>
//                                         <span className="cart-preview-price">
//                                             <strong>{(typeof item.price === 'number' ? item.price : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} / 1 sản phẩm</strong>
//                                         </span>
//                                     </div>
//                                     <button onClick={() => removeFromCart(item.id)} className="cart-preview-remove" aria-label="Xóa"><FaTimes size={12}/></button>
//                                 </li>
//                             ))}
//                         </ul>
//                         <div className="cart-preview-summary">
//                             <span>Tổng cộng:</span>
//                             <span className="cart-preview-total">{(typeof cartTotal === 'number' ? cartTotal : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
//                         </div>
//                         <div className="cart-preview-actions">
//                             <Link to="/cart" className="btn btn-secondary btn-sm" onClick={() => setIsCartPreviewOpen(false)}>Xem giỏ hàng</Link>
//                             <Link to="/checkout" className="btn btn-primary btn-sm" onClick={() => setIsCartPreviewOpen(false)}>Thanh toán</Link>
//                         </div>
//                     </>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <header className="site-header">
//             <div className="header-main">
//                 <div className="container header-main-inner">
//                     <div className="logo">
//                         <Link to="/">
//                             <span className="logo-text noselect">electech</span>
//                         </Link>
//                     </div>
//                     <form className="search-form" onSubmit={handleSearch}>
//                         <input
//                             type="text"
//                             placeholder="Tìm kiếm sản phẩm..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="search-input"
//                         />
//                         <button type="submit" className="search-button"><FaSearch /></button>
//                     </form>
//                     <div className="header-actions">
//                         <div
//                             className="header-action-item cart-action-wrapper"
//                             onMouseEnter={handleCartMouseEnter}
//                             onMouseLeave={handleCartMouseLeave}
//                         >
//                             <Link to="/cart" className={`cart-link-icon ${isAnimating ? 'cart-shake' : ''}`}>
//                                 <FaShoppingCart />
//                                 <span className="noselect">
//                                     Giỏ hàng <span className="cart-count">{cartItemCount}</span>
//                                 </span>
//                             </Link>
//                             {isCartPreviewOpen && renderCartPreview()}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <nav className="header-nav">
//                 <div className="container header-nav-inner">
//                     <div className="main-navigation">
//                         <div className="nav-item">
//                             <NavLink to="/" end>
//                                 Trang chủ
//                             </NavLink>
//                         </div>
//                         <div className="nav-item">
//                             <NavLink to="/shop">
//                                 Cửa hàng
//                             </NavLink>
//                         </div>
//                         <div className="nav-item">
//                             <NavLink to="/contact-us">
//                                 Liên hệ
//                             </NavLink>
//                         </div>
//                         <div className="nav-item">
//                             <NavLink to="/policy">
//                                 Chính sách
//                             </NavLink>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//     );
// };

// export default Header;

// src/components/Header/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, createSearchParams } from 'react-router-dom';
import './Header.css';
import {
    FaSearch, FaShoppingCart, FaTimes, FaPlus, FaMinus, FaBars // THÊM FaBars
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { cartItems, cartItemCount, removeFromCart, cartTotal, updateQuantity } = useCart();
    const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
    const leaveTimeoutRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCartItemCount = useRef(cartItemCount);
    const navigate = useNavigate();

    // --- STATE CHO MOBILE MENU ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (cartItemCount > prevCartItemCount.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        prevCartItemCount.current = cartItemCount;
    }, [cartItemCount]);

    // --- ĐÓNG MOBILE MENU KHI CLICK LINK ---
    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
        // Nếu cart preview đang mở, cũng có thể đóng nó lại
        // setIsCartPreviewOpen(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            console.warn("Search term is empty.");
            return;
        }
        try {
            const searchParams = createSearchParams({ query: searchTerm });
            navigate({
                pathname: '/shop',
                search: searchParams.toString()
            });
            setSearchTerm('');
            setIsMobileMenuOpen(false); // Đóng mobile menu sau khi search
        } catch (error) {
            console.error('Search error:', error);
        }
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

    const renderCartPreview = () => {
        // ... (giữ nguyên)
        return (
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
                                            onClick={() => { setIsCartPreviewOpen(false); handleNavLinkClick(); }} // Đóng cả preview và mobile menu
                                        >
                                            {item.name}
                                        </Link>
                                        <div className="cart-preview-quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="quantity-btn"><FaMinus size={10}/></button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn"><FaPlus size={10}/></button>
                                        </div>
                                        <span className="cart-preview-price">
                                            <strong>{(typeof item.price === 'number' ? item.price : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} / 1 sản phẩm</strong>
                                        </span>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="cart-preview-remove" aria-label="Xóa"><FaTimes size={12}/></button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-preview-summary">
                            <span>Tổng cộng:</span>
                            <span className="cart-preview-total">{(typeof cartTotal === 'number' ? cartTotal : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                        <div className="cart-preview-actions">
                            <Link to="/cart" className="btn btn-secondary btn-sm" onClick={() => { setIsCartPreviewOpen(false); handleNavLinkClick(); }}>Xem giỏ hàng</Link>
                            <Link to="/checkout" className="btn btn-primary btn-sm" onClick={() => { setIsCartPreviewOpen(false); handleNavLinkClick(); }}>Thanh toán</Link>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <header className="site-header">
            <div className="header-main">
                <div className="container header-main-inner">
                    <div className="logo">
                        <Link to="/" onClick={handleNavLinkClick}> {/* Đóng mobile menu khi click logo */}
                            <span className="logo-text noselect">electech</span>
                        </Link>
                    </div>
                    {/* NÚT TOGGLE MOBILE MENU - sẽ hiển thị trên mobile */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />} {/* Thay đổi icon */}
                    </button>

                    <form className={`search-form ${isMobileMenuOpen ? 'mobile-search-open' : ''}`} onSubmit={handleSearch}> {/* Thêm class cho mobile */}
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button"><FaSearch /></button>
                    </form>
                    <div className="header-actions"> {/* header-actions sẽ được xử lý vị trí bằng CSS */}
                        <div
                            className="header-action-item cart-action-wrapper"
                            onMouseEnter={handleCartMouseEnter}
                            onMouseLeave={handleCartMouseLeave}
                        >
                            <Link to="/cart" className={`cart-link-icon ${isAnimating ? 'cart-shake' : ''}`} onClick={handleNavLinkClick}>
                                <FaShoppingCart />
                                <span className="noselect cart-text-label"> {/* Thêm class để ẩn trên mobile nếu cần */}
                                    Giỏ hàng <span className="cart-count">{cartItemCount}</span>
                                </span>
                            </Link>
                            {isCartPreviewOpen && renderCartPreview()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thêm class is-open cho header-nav khi isMobileMenuOpen là true */}
            <nav className={`header-nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
                <div className="container header-nav-inner">
                    {/* Main navigation sẽ được ẩn/hiện bằng CSS */}
                    <div className="main-navigation">
                        <div className="nav-item">
                            <NavLink to="/" end onClick={handleNavLinkClick}>
                                Trang chủ
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/shop" onClick={handleNavLinkClick}>
                                Cửa hàng
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/contact-us" onClick={handleNavLinkClick}>
                                Liên hệ
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/policy" onClick={handleNavLinkClick}>
                                Chính sách
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;