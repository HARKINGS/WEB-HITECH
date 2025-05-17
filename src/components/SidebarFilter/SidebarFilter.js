// src/components/SidebarFilter/SidebarFilter.js
import React, { useState } from 'react';
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom'; // Thêm useNavigate, createSearchParams, useLocation
import './SidebarFilter.css';

const FilterSection = ({ title, children }) => (
  <div className="filter-section">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-content">{children}</div>
  </div>
);

// Giả sử availableCategories là một mảng các object { id: 'electronics', name: 'Đồ điện tử' }
// Hoặc là mảng các string nếu BE trả về như vậy
const SidebarFilter = ({ availableCategories = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);
  const currentCategory = currentParams.get('category') || ''; // Lấy category hiện tại từ URL

  const handleCategoryClick = (categoryValue) => {
    // Nếu categoryValue giống category hiện tại, có thể bỏ chọn (điều hướng về /shop)
    // Hoặc đơn giản là luôn điều hướng
    const searchParams = createSearchParams();
    if (categoryValue && categoryValue !== currentCategory) {
        searchParams.set('category', categoryValue);
    }
    // Nếu không có categoryValue (người dùng bỏ chọn hoặc chọn lại cái đang active)
    // hoặc categoryValue giống cái hiện tại và bạn muốn bỏ chọn, thì không set param.
    // Nếu không set param nào, nó sẽ về /shop
    navigate({
        pathname: '/shop',
        search: searchParams.toString()
    });
  };

  // categoriesData sẽ được truyền từ ShopPage sau khi lấy từ API hoặc từ allProducts
  // Ví dụ: availableCategories = ['Laptop', 'Phụ kiện', 'PC_Gaming']
  // Hoặc [{id: 'Laptop', name: 'Laptop'}, {id: 'Phu kien', name: 'Phụ kiện'}]
  // Chúng ta sẽ giả định availableCategories là mảng các string (tên danh mục)

  return (
    <aside className="sidebar-filters">
      {availableCategories.length > 0 && (
        <FilterSection title="Lọc theo danh mục">
          <ul className="category-filter-list">
            {/* Thêm tùy chọn "Tất cả danh mục" để xóa filter */}
            <li
                key="all-categories"
                className={`category-filter-item ${currentCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('')} // Rỗng để xóa filter category
            >
                Tất cả danh mục
            </li>
            {availableCategories.map(catName => (
              <li
                key={catName}
                className={`category-filter-item ${currentCategory === catName ? 'active' : ''}`}
                onClick={() => handleCategoryClick(catName)}
              >
                {catName}
              </li>
            ))}
          </ul>
        </FilterSection>
      )}
      {/* Các bộ lọc khác như giá sẽ rất khó thực hiện theo kiểu "load lại trang" vì BE không có API */}
    </aside>
  );
};

export default SidebarFilter;