// src/components/ProductCard/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

// Sửa hàm renderStars để nhận goodsId làm tham số cho key
const renderStars = (rating = 0, goodsId = 'default') => { // Thêm goodsId, có giá trị mặc định
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            // Sử dụng goodsId để tạo key duy nhất cho mỗi sản phẩm
            stars.push(<FaStar key={`star-full-${goodsId}-${i}`} className="star-icon filled" />);
        } else {
            stars.push(<FaRegStar key={`star-empty-${goodsId}-${i}`} className="star-icon empty" />);
        }
    }
    return stars;
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

    const {
        goodsId = '',
        goodsName = 'Sản phẩm không tên',
        price = 0,
        goodsImageURL = '',
        quantity = 0, // Thêm quantity để kiểm tra hết hàng
        averageRating = 0 // Giả sử có trường này từ product prop
    } = product || {};

    if (!goodsId) {
        // console.warn("ProductCard received invalid or incomplete product data:", product);
        // return null; 
    }

    const productUrl = `/products/${goodsId}`;

    let displayImageUrl = goodsImageURL;
    if (goodsImageURL && !goodsImageURL.startsWith('http') && !goodsImageURL.startsWith('//')) {
        const separator = (apiBaseUrl.endsWith('/') || goodsImageURL.startsWith('/')) ? '' : '/';
        displayImageUrl = `${apiBaseUrl}${separator}${goodsImageURL.startsWith('/') ? goodsImageURL.substring(1) : goodsImageURL}`;
    }
    const finalDisplayImageUrl = displayImageUrl || '/placeholder-product-image.png';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!goodsId) {
            console.error("Cannot add to cart: Product ID is missing.");
            return;
        }
        
        let cartImageUrl = goodsImageURL;
        if (goodsImageURL && !goodsImageURL.startsWith('http') && !goodsImageURL.startsWith('//')) {
            const separator = (apiBaseUrl.endsWith('/') || goodsImageURL.startsWith('/')) ? '' : '/';
            cartImageUrl = `${apiBaseUrl}${separator}${goodsImageURL.startsWith('/') ? goodsImageURL.substring(1) : goodsImageURL}`;
        }
        const finalCartImageUrl = cartImageUrl || '/placeholder-product-image.png';

        const cartItem = {
            id: goodsId,
            name: goodsName,
            price: Number(price),
            imageUrl: finalCartImageUrl,
        };
        addToCart(cartItem);
    };

    return (
        <div className="product-card">
            <Link to={productUrl} className="product-image-link">
                <img
                    src={finalDisplayImageUrl}
                    alt={goodsName}          
                    className="product-image"
                    onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-product-image.png'; }}
                />
            </Link>
            <div className="product-info">
                <h3 className="product-name">
                    <Link to={productUrl}>{goodsName}</Link>
                </h3>
                    {/* Truyền goodsId vào renderStars */}
                {/* <div className="product-rating">
                    {renderStars(averageRating, goodsId)} 
                </div> */}
                <div className="product-price">
                    <span className="current-price">{(Number(price) || 0).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="product-actions">
                    <button 
                        onClick={handleAddToCart} 
                        className="btn btn-add-to-cart"
                        disabled={quantity <= 0}
                    >
                        <FaShoppingCart /> {quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;