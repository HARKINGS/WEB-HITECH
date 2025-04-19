import React from 'react';
import './SidebarFilter.css';
import { FaStar, FaRegStar } from 'react-icons/fa';

// Component con cho từng loại filter (ví dụ)
const FilterSection = ({ title, children }) => (
  <div className="filter-section">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-content">{children}</div>
  </div>
);

const SidebarFilter = () => {
  // State cho giá trị filter sẽ được thêm sau
  return (
    <aside className="sidebar-filters">
      <FilterSection title="Shop By Categories">
        <ul>
          <li><a href="#">Our Store (24)</a></li>
          <li><a href="#">Smartphones (5)</a></li>
          {/* Thêm các categories khác */}
          <li><a href="#">Laptops & Computers (20)</a></li>
          <li><a href="#">Special offer (4)</a></li>
        </ul>
      </FilterSection>

      <FilterSection title="Highlight">
         {/* Checkboxes hoặc links */}
         <div><input type="checkbox" id="hl-promo" /> <label htmlFor="hl-promo">Promotion</label></div>
         <div><input type="checkbox" id="hl-new" /> <label htmlFor="hl-new">New Arrivals</label></div>
         {/* ... */}
      </FilterSection>

      <FilterSection title="Filter By Color">
        <div className="color-filter">
          <span className="color-swatch" style={{ backgroundColor: '#ff0000' }} title="Red"></span>
          <span className="color-swatch" style={{ backgroundColor: '#0000ff' }} title="Blue"></span>
          {/* Thêm các màu khác */}
          <span className="color-swatch active" style={{ backgroundColor: '#008000' }} title="Green"></span>
          <span className="color-swatch" style={{ backgroundColor: '#ffff00' }} title="Yellow"></span>
          <span className="color-swatch" style={{ backgroundColor: '#000000' }} title="Black"></span>
        </div>
      </FilterSection>

      {/* Thêm các Filter Sections khác: RAM, Brands, Internal Storage */}

      <FilterSection title="Price Filter">
        {/* Slider hoặc input range */}
        <div className="price-slider-placeholder">Price Slider Goes Here</div>
        <div>Price: $50 - $1,040+</div> {/* Hiển thị giá trị hiện tại */}
      </FilterSection>

      <FilterSection title="Average Rating">
        <div className="rating-filter">
          <div><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> (10)</div>
          <div><FaStar/><FaStar/><FaStar/><FaStar/><FaRegStar/> (5)</div>
          {/* ... */}
        </div>
      </FilterSection>
    </aside>
  );
};

export default SidebarFilter;