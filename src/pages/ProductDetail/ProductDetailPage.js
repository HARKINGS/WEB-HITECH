  // src/pages/ProductDetail/ProductDetailPage.js
  import React, { useState, useEffect } from 'react';
  import { useParams, Link } // Thêm Link nếu cần cho breadcrumbs hoặc related products
      from 'react-router-dom';
  // import { mockProducts } from '../../data/mockData'; // Xóa hoặc comment dòng này
  import ProductCard from '../../components/ProductCard/ProductCard';
  import { useCart } from '../../contexts/CartContext';
  import './ProductDetailPage.css';
  import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';

  import { getGoodsById, getAllGoods } from '../../services/goodsService'; // Import service lấy chi tiết và có thể cả ds sản phẩm

  // Hàm render sao (giữ nguyên hoặc tùy chỉnh)
  const renderStars = (rating = 0) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
              stars.push(<FaStar key={`full-${i}`} />);
          } else {
              stars.push(<FaRegStar key={`empty-${i}`} />);
          }
      }
      return stars;
  };

  // --- Helper để format tiền tệ (NÊN THỐNG NHẤT SỬ DỤNG) ---
  const formatCurrencyVND = (amount) => {
      if (typeof amount !== 'number' || isNaN(amount)) {
          return '0 ₫';
      }
      return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };


  const ProductDetailPage = () => {
      const { productId } = useParams();
      const [product, setProduct] = useState(null);
      const [relatedProducts, setRelatedProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [quantity, setQuantity] = useState(1);
      const [activeTab, setActiveTab] = useState('description');
      const { addToCart } = useCart();


      useEffect(() => {
          const fetchProductData = async () => {
              if (productId) {
                  setLoading(true);
                  setError(null);
                  try {
                      // Fetch chi tiết sản phẩm chính
                      const mainProductData = await getGoodsById(productId);
                      setProduct(mainProductData);
                      console.log("Fetched main product:", mainProductData);

                      // Fetch các sản phẩm liên quan
                      if (mainProductData) { // Chỉ fetch related nếu có sản phẩm chính
                          const allProductsData = await getAllGoods();
                          let related = allProductsData
                              .filter(p => p.goodsId !== mainProductData.goodsId && p.goodsCategory === mainProductData.goodsCategory);

                          // Xáo trộn mảng related và lấy 4 phần tử đầu
                          related.sort(() => 0.5 - Math.random()); // Xáo trộn đơn giản
                          setRelatedProducts(related.slice(0, 4));
                          console.log("Fetched related products:", related);
                      }

                  } catch (err) {
                      console.error("Error fetching product data:", err);
                      setError(err.message);
                  } finally {
                      setLoading(false);
                  }
              }
          };

          fetchProductData();
      }, [productId]); // Chạy lại khi productId thay đổi

      if (loading) {
          return <div className="container product-detail-loading"><p>Đang tải thông tin sản phẩm...</p></div>;
      }

      if (error) {
          return <div className="container product-detail-error"><p>Lỗi: {error}</p></div>;
      }

      if (!product) {
          return <div className="container product-detail-not-found"><p>Không tìm thấy sản phẩm.</p></div>;
      }

      const handleQuantityChange = (amount) => {
          setQuantity(prev => Math.max(1, prev + amount));
      };

      const handleAddToCartClick = () => {
          if (product) {
              // Tạo object cartItem với cấu trúc mà CartContext mong đợi
              const cartItem = {
                  id: product.goodsId,
                  name: product.goodsName,
                  price: Number(product.price),
                  imageUrl: product.goodsImageURL,
                  // quantity sẽ được truyền vào addToCart
              };
              addToCart(cartItem, quantity);
              // alert(`${quantity} x ${product.goodsName} đã được thêm vào giỏ!`);
          }
      };

      return (
          <div className="product-detail-page">
              <div className="container">
                  <div className="breadcrumbs">
                      <Link to="/">Trang chủ</Link> / <Link to="/shop">Cửa hàng</Link> / <span>{product.goodsName}</span>
                  </div>

                  <div className="product-detail-main">
                      <div className="product-gallery">
                          <div className="main-image">
                              <img src={`${process.env.REACT_APP_API_BASE_URL}${product.goodsImageURL}` || '/path/to/placeholder.jpg'} alt={product.goodsName} />
                              {/* {product.salePercent && <span className="badge badge-sale">-{product.salePercent}%</span>} */}
                          </div>
                      </div>

                      <div className="product-info-details">
                          <h1 className="product-title">{product.goodsName}</h1>
                          <div className="product-meta">
                              <div className="rating">
                                  {renderStars(0)} {/* Tạm thời 0 sao, cần dữ liệu rating từ API */}
                              </div>
                          </div>
                          <div className="product-price-detail">
                              <span className="current-price">{formatCurrencyVND(Number(product.price))}</span>
                              {/* {product.oldPrice && <span className="old-price">{formatCurrencyVND(Number(product.oldPrice))}</span>} */}
                          </div>
                          <div className="product-short-description">
                              <p>{product.goodsDescription || 'Chưa có mô tả ngắn cho sản phẩm này.'}</p>
                          </div>

                          <div className="product-actions-detail">
                              <div className="quantity-selector">
                                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                  <input type="number" value={quantity} readOnly />
                                  <button onClick={() => handleQuantityChange(1)}>+</button>
                              </div>
                              <button className="btn btn-add-to-cart-detail" onClick={handleAddToCartClick}>
                                  <FaShoppingCart /> Thêm vào giỏ hàng
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="product-tabs">
                      <div className="tab-headers">
                          <button
                              className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                              onClick={() => setActiveTab('description')}
                          >
                              Mô tả
                          </button>
                          <button
                              className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                              onClick={() => setActiveTab('reviews')}
                          >
                              Đánh giá {/* ({product.reviews ? product.reviews.length : 0}) Cần API lấy review */}
                          </button>
                      </div>
                      <div className="tab-content">
                          {activeTab === 'description' && (
                              <div className="tab-pane active">
                                  <h4>Mô tả sản phẩm</h4>
                                  <p>{product.goodsDescription || 'Thông tin mô tả chi tiết đang được cập nhật.'}</p>
                              </div>
                          )}
                          {activeTab === 'reviews' && (
                              <div className="tab-pane active">
                                  <h4>Đánh giá từ khách hàng</h4>
                                  {/* TODO: Fetch và hiển thị reviews cho product.goodsId */}
                                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                              </div>
                          )}
                      </div>
                  </div>

                  {relatedProducts.length > 0 && (
                      <div className="related-products">
                          <h2>Các sản phẩm cũng được quan tâm</h2>
                          <div className="product-grid related-grid">
                              {relatedProducts.map(relProduct => (
                                  <ProductCard key={relProduct.goodsId} product={relProduct} />
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  export default ProductDetailPage;