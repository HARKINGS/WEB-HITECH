import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { mockProducts } from '../../data/mockData'; // Import dữ liệu giả
import './HomePage.css';

const HomePage = () => {
  // Lấy một vài sản phẩm để hiển thị (ví dụ: sản phẩm mới nhất)
  const featuredProducts = mockProducts.slice(0, 4); // Lấy 4 sản phẩm đầu

  return (
    <div className="home-page">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="container">
          {/* Nội dung banner/slider ở đây */}
          <h1>Welcome to Electech</h1>
          <p>Your one-stop shop for the latest electronics.</p>
          {/* <img src="/path/to/hero-banner.jpg" alt="Hero Banner" /> */}
          <div className="hero-placeholder">Hero Banner / Slider Placeholder</div>
        </div>
      </section>

      {/* --- Featured Products Section --- */}
      <section className="featured-products-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

       {/* --- Other Sections --- */}
       {/* Thêm các section khác: Featured Categories, Deals, Banners,... */}
       <section className="other-section">
          <div className="container">
            <h2>More Content Here</h2>
            <p>Add featured categories, special offers, etc.</p>
          </div>
       </section>

    </div>
  );
};

export default HomePage;