// src/pages/Home/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import './HomePage.css';
import { getAllGoods } from '../../services/goodsService';
// Import thư viện slider (ví dụ: react-slick) hoặc bạn có thể tự code slider đơn giản
// Ví dụ với react-slick: npm install react-slick slick-carousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bannerImg from '../../assets/images/banner.png';

const HomePage = () => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSelectRandomProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProducts = await getAllGoods();
        if (allProducts && allProducts.length > 0) {
          // Xáo trộn mảng sản phẩm
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          // Lấy 6-8 sản phẩm đầu tiên sau khi xáo trộn để hiển thị trong slider
          setRandomProducts(shuffled.slice(0, Math.min(8, shuffled.length))); // Lấy tối đa 8 sản phẩm
        } else {
          setRandomProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products for homepage slider:", err);
        setError(err.message || "Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSelectRandomProducts();
  }, []);

  // Cấu hình cho react-slick slider
  const sliderSettings = {
    dots: true, // Hiển thị chấm điều hướng
    infinite: randomProducts.length > 3, 
    speed: 200, // Tốc độ chuyển slide
    slidesToShow: 4,
    slidesToScroll: 1, 
    autoplay: true,
    autoplaySpeed: 1200, 
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="home-page">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="container">
          <h1>Chào mừng đến với Electech</h1>
          <p>Điểm đến đúng đắn của bạn cho các thiết bị điện tử HOT nhất.</p>
          <div className="hero-placeholder">
            <img
              src={bannerImg} // Đảm bảo bannerImg đã được import chính xác
              alt="Banner quảng cáo sản phẩm"
            />
             Hero Banner / Slider Placeholder
          </div>
        </div>
      </section>

      {/* --- Random Products Slider Section --- */}
      <section className="random-products-slider-section">
        <div className="container"> {/* Container này sẽ giới hạn max-width */}
          <h2>Có thể bạn sẽ thích</h2>
          {loading && <p>Đang tải sản phẩm...</p>}
          {error && <p className="error-message">Lỗi: {error}</p>}
          {!loading && !error && randomProducts.length === 0 && (
            <p>Hiện chưa có sản phẩm nào.</p>
          )}
          {!loading && !error && randomProducts.length > 0 && (
            <div className="product-slider-wrapper"> {/* Wrapper cho slider */}
              <Slider {...sliderSettings}>
                {randomProducts.map(product => (
                  <div key={product.goodsId} className="slider-item-padding"> {/* Thêm padding cho từng item */}
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </section>

      {/* --- Section khác (ví dụ: Featured Categories) --- */}
      {/* <section className="featured-categories-section">
          <div className="container">
              <h2>Danh mục nổi bật</h2>
              <div className="categories-grid-home">
                  <Link to="/shop?category=Laptop" className="category-card-home">
                      <div className="category-icon-placeholder">LAPTOP</div>
                      <span>Laptop</span>
                  </Link>
                  <Link to="/shop?category=Phụ kiện" className="category-card-home">
                      <div className="category-icon-placeholder">PHỤ KIỆN</div>
                      <span>Phụ kiện</span>
                  </Link>
                  <Link to="/shop?category=PC_Gaming" className="category-card-home">
                      <div className="category-icon-placeholder">PC GAMING</div>
                      <span>PC Gaming</span>
                  </Link>
              </div>
          </div>
      </section> */}
    </div>
  );
};

export default HomePage;