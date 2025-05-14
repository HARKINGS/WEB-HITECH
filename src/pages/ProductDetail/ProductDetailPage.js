import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockProducts } from '../../data/mockData'; // Dùng dữ liệu giả
import ProductCard from '../../components/ProductCard/ProductCard'; // Để hiển thị related products
import { useCart } from '../../contexts/CartContext'; 
import './ProductDetailPage.css';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaExchangeAlt } from 'react-icons/fa';

// Hàm render sao (có thể đưa ra utils)
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0; // Check if there's a decimal part (not needed for simple full stars)

  for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
  }
  // For simplicity here, we'll only use full stars or empty stars based on rounding or floor
  for (let i = fullStars; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
  }
  return stars;
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    // Tìm sản phẩm trong mock data dựa vào productId từ URL
    const foundProduct = mockProducts.find(p => p.id === parseInt(productId));
    setProduct(foundProduct);
    // Trong ứng dụng thực tế, bạn sẽ fetch dữ liệu từ API ở đây
    // fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setProduct(data));
  }, [productId]);

  if (!product) {
    return <div className="container">Loading product...</div>; // Hoặc trang lỗi
  }

  // Lấy một vài sản phẩm khác làm "related"
  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount)); // Không cho số lượng < 1
  };

  // --- Handler for Add to Cart Button ---
  const handleAddToCartClick = () => {
    if (product) {
      addToCart(product, quantity); // <-- Call context function
      // Optional: Show a confirmation message to the user
      // alert(`${quantity} x ${product.name} added to cart!`);
      // Maybe reset quantity after adding? (Optional)
      // setQuantity(1);
    }
  };
  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumbs (nên tạo component riêng) */}
        <div className="breadcrumbs">
            <a href="/">Home</a> / <a href="/shop">Shop</a> / <span>{product.name}</span>
        </div>

        <div className="product-detail-main">
          {/* Product Gallery */}
          <div className="product-gallery">
             {/* Ảnh chính */}
             <div className="main-image">
                <img src={product.imageUrl || '/path/to/placeholder.jpg'} alt={product.name} />
                {product.salePercent && <span className="badge badge-sale">-{product.salePercent}%</span>}
             </div>
             {/* Thumbnails (nếu có nhiều ảnh) */}
             {/* <div className="thumbnail-images"> ... </div> */}
          </div>

          {/* Product Info */}
          <div className="product-info-details">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <div className="rating">
                {renderStars(product.rating)}
                {/* <span>(5 comment)</span> */}
              </div>
              {/* <div className="sku">SKU: {product.sku || 'N/A'}</div> */}
              {/* <div className="availability">Availability: In Stock</div> */}
            </div>
            <div className="product-price-detail">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
            </div>
            <div className="product-short-description">
              {/* Mô tả ngắn gọn ở đây */}
              <p>This is a short description of the product. Highlighting key features and benefits.</p>
            </div>

            {/* Options (Màu sắc, Kích thước - nếu có) */}
            {/* <div className="product-options"> ... </div> */}

            {/* Quantity & Add to Cart */}
            <div className="product-actions-detail">
               <div className="quantity-selector">
                   <button onClick={() => handleQuantityChange(-1)}>-</button>
                   <input type="number" value={quantity} readOnly />
                   <button onClick={() => handleQuantityChange(1)}>+</button>
               </div>
               <button className="btn btn-add-to-cart-detail"  onClick={handleAddToCartClick}>
                   <FaShoppingCart /> Thêm vào giỏ hàng
               </button>
            </div>

            {/* Wishlist & Compare */}
            {/* <div className="product-secondary-actions">
               <button className="btn-icon"><FaHeart /> Add to Wishlist</button>
            </div> */}

             {/* Meta info: Categories, Tags */}
             {/* <div className="product-meta-info"> ... </div> */}
          </div>
        </div>

        {/* Product Tabs (Description, comment, etc.) */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button
              className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả
            </button>
            <button
              className={`tab-header ${activeTab === 'comment' ? 'active' : ''}`}
              onClick={() => setActiveTab('comment')}
            >
              Bình luận ({/* Số lượng review */ 0})
            </button>
             {/* Thêm tab Additional Information, Shipping & Returns nếu cần */}
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane active">
                <h4>Mô tả sản phẩm</h4>
                <p>Detailed description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                {/* Thêm nội dung mô tả */}
              </div>
            )}
            {activeTab === 'comment' && (
              <div className="tab-pane active">
                <h4>Bình luận từ khách hàng</h4>
                {/* Hiển thị danh sách review và form để viết review */}
                <p>Không có bình luận nào.</p>
                {/* <div className="review-list"> ... </div> */}
                {/* <div className="add-review-form"> ... </div> */}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
           <h2>Các sản phẩm cũng được quan tâm</h2>
           <div className="product-grid related-grid">
              {relatedProducts.map(relProduct => (
                  <ProductCard key={relProduct.id} product={relProduct} />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;