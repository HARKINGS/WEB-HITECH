// ShopPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for breadcrumbs
import SidebarFilter from '../../components/SidebarFilter/SidebarFilter';
import ProductCard from '../../components/ProductCard/ProductCard';
import { mockProducts } from '../../data/mockData'; // Import dữ liệu giả
import './ShopPage.css';
import { FaThLarge, FaList } from 'react-icons/fa'; // Bỏ FaChevronDown nếu select dùng mặc định

const ShopPage = () => {
  // Logic lọc và sắp xếp sẽ được thêm vào đây sau
  const productsToDisplay = mockProducts;
  const totalProducts = mockProducts.length; // Lấy tổng số sản phẩm

  return (
    <div className="shop-page dark-theme"> {/* Thêm class theme */}
      {/* **NEW**: Shop Page Header */}
      <div className="shop-header container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <span>Shop</span>
        </div>
        <h1 className="page-title">Shop</h1>
      </div>

      <div className="container shop-container">
        {/* --- Sidebar --- */}
        <aside className="shop-sidebar">
          {/* **NOTE**: SidebarFilter component cần được style riêng */}
          <SidebarFilter />
        </aside>

        {/* --- Main Content --- */}
        <div className="shop-main-content">
          {/* Top Bar Controls */}
          <div className="shop-controls">
            <div className="controls-left">
              {/* Hiển thị số lượng kết quả */}
              <p className="shop-info">Showing all {totalProducts} results</p>
            </div>
            <div className="controls-right">
               {/* Select sắp xếp */}
              <div className="sort-options">
                  <select name="orderby" className="orderby" aria-label="Shop order">
                      <option value="menu_order" >Default sorting</option>
                      <option value="popularity">Sort by popularity</option>
                      <option value="rating">Sort by average rating</option>
                      <option value="date">Sort by latest</option>
                      <option value="price">Sort by price: low to high</option>
                      <option value="price-desc">Sort by price: high to low</option>
                  </select>
              </div>
              {/* Nút chuyển đổi view */}
               <div className="view-options">
                  <button className="view-btn grid active" title="Grid view"> {/* Thêm title */}
                      <FaThLarge />
                      {/* <span className="tooltip">Grid</span> */}
                  </button>
                  <button className="view-btn list" title="List view"> {/* Thêm title */}
                      <FaList />
                      {/* <span className="tooltip">List</span> */}
                  </button>
               </div>
            </div>
          </div>

          {/* Product Grid/List */}
          {/* **NOTE**: Class grid sẽ thay đổi tùy theo view được chọn */}
          <div className="shop-product-grid view-grid">
            {productsToDisplay.map(product => (
              // **NOTE**: ProductCard component cần được style riêng
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <nav className="shop-pagination">
             {/* Pagination controls sẽ phức tạp hơn, tạm để placeholder */}
             <span className="page-numbers current">1</span>
             <a className="page-numbers" href="#">2</a>
             <a className="next page-numbers" href="#">→</a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;