// src/components/SidebarFilter/SidebarFilter.js
import React, { useState, useEffect, useCallback } from 'react';
import './SidebarFilter.css';

const FilterSection = ({ title, children }) => (
  <div className="filter-section">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-content">{children}</div>
  </div>
);

const CATEGORIES_DATA = [
    { id: 'Laptop', name: 'Laptop' },
    { id: 'PC_Gaming', name: 'PC Gaming' },
    { id: 'Phụ kiện', name: 'Phụ kiện' },
];

const SidebarFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, ''); // Chỉ giữ lại số
    setPriceRange(prev => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const formatDisplayPrice = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value); // value đã là chuỗi số
    if (isNaN(num)) return '';
    return num.toLocaleString('vi-VN'); // Ví dụ: 100000 -> "100.000"
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(cId => cId !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const memoizedOnFilterChange = useCallback(onFilterChange, [onFilterChange]);

  useEffect(() => {
    const parsePriceForFilter = (priceStr) => {
        if (priceStr === '' || priceStr === null || priceStr === undefined) return null;
        const cleanedStr = String(priceStr).replace(/[^0-array]/g, ''); // Should be unnecessary if input is controlled
        if (cleanedStr === '') return null;
        return parseFloat(cleanedStr);
    };

    const filters = {
      priceRange: {
        min: parsePriceForFilter(priceRange.min),
        max: parsePriceForFilter(priceRange.max),
      },
      categories: selectedCategories,
    };
    
    if (memoizedOnFilterChange) {
        memoizedOnFilterChange(filters);
    }
  }, [priceRange, selectedCategories, memoizedOnFilterChange]);

  return (
    <aside className="sidebar-filters">
      <FilterSection title="Lọc theo danh mục">
        {/* ... (phần category giữ nguyên) ... */}
         {CATEGORIES_DATA.length > 0 ? (
            <ul>
            {CATEGORIES_DATA.map(cat => (
                <li key={cat.id}>
                <label>
                    <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    />
                    {cat.name}
                </label>
                </li>
            ))}
            </ul>
        ) : (
            <p className="no-categories-message">Không có danh mục nào.</p>
        )}
      </FilterSection>

      <FilterSection title="Lọc theo giá">
        <div className="price-input-group">
          <input
            type="text"
            name="min"
            // THAY ĐỔI PLACEHOLDER
            placeholder="vd: 100.000" // Hoặc "Từ 000 ₫"
            value={formatDisplayPrice(priceRange.min)}
            onChange={handlePriceInputChange}
            className="price-input"
            // pattern="[0-9]*" // Có thể thêm pattern để bàn phím mobile hiển thị số (tùy trình duyệt)
            // inputMode="numeric" // Gợi ý bàn phím số
          />
          <span className="price-separator">-</span>
          <input
            type="text"
            name="max"
            // THAY ĐỔI PLACEHOLDER
            placeholder="vd: 5.000.000" // Hoặc "Đến 000 ₫"
            value={formatDisplayPrice(priceRange.max)}
            onChange={handlePriceInputChange}
            className="price-input"
            // pattern="[0-9]*"
            // inputMode="numeric"
          />
        </div>
        {/* Bạn có thể hiển thị giá trị đang được lọc ở đây nếu muốn */}
        {/* <div className="current-filter-price-display">
            Đang lọc từ: {formatDisplayPrice(priceRange.min) || '0'}₫
            đến: {formatDisplayPrice(priceRange.max) || 'Không giới hạn'}
            {priceRange.max ? '₫' : ''}
        </div> */}
      </FilterSection>
    </aside>
  );
};

export default SidebarFilter;