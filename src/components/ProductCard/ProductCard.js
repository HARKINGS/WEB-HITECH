import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa'; 

// Hàm render sao đơn giản
const renderStars = (rating) => {
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
  const { id, name, price, oldPrice, imageUrl, rating, isNew, salePercent } = product;

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-image-link">
        <img src={imageUrl || '/path/to/placeholder.jpg'} alt={name} className="product-image" />
        {isNew && <span className="badge badge-new">NEW</span>}
        {salePercent && <span className="badge badge-sale">-{salePercent}%</span>}
        {/* Thêm nút quick view nếu cần */}
      </Link>
      <div className="product-info">
        {/* <div className="product-category">Category Name</div> */}
        <h3 className="product-name">
          <Link to={`/products/${id}`}>{name}</Link>
        </h3>
        <div className="product-rating">
          {renderStars(rating)}
          {/* <span className="rating-count">(10)</span> */}
        </div>
        <div className="product-price">
          <span className="current-price">${price.toFixed(2)}</span>
          {oldPrice && <span className="old-price">${oldPrice.toFixed(2)}</span>}
        </div>
        <div className="product-actions">
            {/* Nút Add to cart hoặc Select Options tùy thuộc vào loại sản phẩm */}
            <button className="btn btn-add-to-cart">
                <FaShoppingCart /> Add to Cart
            </button>
             {/* <button className="btn btn-select-options">Select Options</button> */}
            {/* Thêm nút Wishlist, Compare */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;