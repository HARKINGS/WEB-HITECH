// // ProductCard.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './ProductCard.css';
// import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
// import { useCart } from '../../contexts/CartContext'; 

// const renderStars = (rating) => {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//       stars.push(<FaStar key={`full-${i}`} className="star-icon filled" />);
//     } else {
//       stars.push(<FaRegStar key={`empty-${i}`} className="star-icon empty" />);
//     }
//   }
//   return stars;
// };

// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart(); // Get addToCart function from context

//   const { id, name, price = 0, oldPrice, imageUrl, rating = 0, isNew, salePercent } = product || {};

//   if (!product || !id) {
//     return null;
//   }

//   const productUrl = `/products/${id}`;

//   // --- Handler for Add to Cart button ---
//   const handleAddToCart = (e) => {
//     e.preventDefault(); // Prevent any default button behavior if necessary
//     e.stopPropagation(); // Prevent triggering link navigation if nested somehow
//     addToCart(product);
//     // Optionally provide feedback to the user here
//   };
//   // --- End Handler ---

//   return (
//     <div className="product-card">
//       <Link to={productUrl} className="product-image-link">
//         <img src={imageUrl || '/path/to/placeholder.jpg'} alt={name || 'Product Image'} className="product-image" />
//         {isNew && <span className="badge badge-new">NEW</span>}
//         {salePercent && <span className="badge badge-sale">-{salePercent}%</span>}
//       </Link>
//       <div className="product-info">
//         <h3 className="product-name">
//           <Link to={productUrl}>{name || 'Unnamed Product'}</Link>
//         </h3>
//         <div className="product-rating">
//           {renderStars(rating)}
//         </div>
//         <div className="product-price">
//            {/* Simple currency format, consider using Intl.NumberFormat */}
//            <span className="current-price">₫{price.toLocaleString('vi-VN')}</span>
//            {oldPrice && <span className="old-price">₫{oldPrice.toLocaleString('vi-VN')}</span>}
//         </div>
//         <div className="product-actions">
//             {/* --- CHANGED BACK TO BUTTON --- */}
//             <button onClick={handleAddToCart} className="btn btn-add-to-cart">
//                 <FaShoppingCart /> Thêm vào giỏ
//             </button>
//             {/* --- END CHANGE --- */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


// src/components/ProductCard/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa'; // FaStar, FaRegStar có thể chưa dùng ngay
import { useCart } from '../../contexts/CartContext';

// Tạm thời comment out hoặc điều chỉnh renderStars nếu chưa có dữ liệu rating
const renderStars = (rating = 0) => { // Mặc định rating là 0
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<FaStar key={`full-${i}`} className="star-icon filled" />);
        } else {
            stars.push(<FaRegStar key={`empty-${i}`} className="star-icon empty" />);
        }
    }
    return stars;
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const {
        goodsId,
        goodsName,
        price = 0,
        goodsImageURL,
        // goodsVersion, // Bạn có thể muốn thêm vào cartItem nếu cần
        // goodsCategory // Bạn có thể muốn thêm vào cartItem nếu cần
    } = product || {};

    if (!product || !goodsId) {
        console.warn("ProductCard received invalid product data:", product);
        return null;
    }

    const productUrl = `/products/${goodsId}`;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Tạo object cartItem với cấu trúc mà CartContext mong đợi
        const cartItem = {
            id: goodsId,         // Map goodsId từ API sang id
            name: goodsName,     // Map goodsName từ API sang name
            price: Number(price),// Đảm bảo price là number, map price từ API
            imageUrl: goodsImageURL // Map goodsImageURL từ API sang imageUrl
            // quantity sẽ được xử lý bên trong addToCart của CartContext
        };
        addToCart(cartItem); // Truyền cartItem đã được map
        // console.log(`${cartItem.name} added to cart (from ProductCard)`); // Optional: for debugging
    };

    return (
        <div className="product-card">
            <Link to={productUrl} className="product-image-link">
                <img
                    src={goodsImageURL || '/path/to/placeholder.jpg'}
                    alt={goodsName || 'Product Image'}
                    className="product-image"
                />
            </Link>
            <div className="product-info">
                <h3 className="product-name">
                    <Link to={productUrl}>{goodsName || 'Unnamed Product'}</Link>
                </h3>
                {/* <div className="product-rating">{renderStars(0)}</div>  // Tạm ẩn nếu chưa có rating */}
                <div className="product-price">
                    <span className="current-price">₫{Number(price).toLocaleString('vi-VN')}</span>
                </div>
                <div className="product-actions">
                    <button onClick={handleAddToCart} className="btn btn-add-to-cart">
                        <FaShoppingCart /> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;