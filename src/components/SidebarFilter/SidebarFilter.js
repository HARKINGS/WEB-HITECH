// src/components/SidebarFilter/SidebarFilter.js
import React, { useState, useEffect, useCallback } from 'react';
import './SidebarFilter.css';
// FaStar and FaRegStar are no longer needed if rating filter is removed
// import { FaStar, FaRegStar } from 'react-icons/fa';

const FilterSection = ({ title, children }) => (
  <div className="filter-section">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-content">{children}</div>
  </div>
);

// DANH MỤC SẢN PHẨM ĐƯỢC ĐỊNH NGHĨA SẴN Ở ĐÂY
// Ensure these 'id' values match what your product data uses for 'goodsCategory'
const CATEGORIES_DATA = [
    { id: 'Laptop', name: 'Laptop' },
    { id: 'PC_Gaming', name: 'PC Gaming' },
    { id: 'Phụ kiện', name: 'Phụ kiện' },
    // Add more predefined categories as needed
    // { id: 'Smartphone', name: 'Điện thoại thông minh' },
    // { id: 'Tablet', name: 'Máy tính bảng' },
];

const SidebarFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores IDs of selected categories

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only numeric input for price, but store as string for flexible display formatting
    const numericValue = value.replace(/[^0-9]/g, '');
    setPriceRange(prev => ({
      ...prev,
      [name]: numericValue, // Store the raw numeric string
    }));
  };

  const formatDisplayPrice = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    // Parse the numeric string before formatting
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('vi-VN');
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
        // The priceStr should already be just digits due to handlePriceInputChange logic
        const cleanedStr = String(priceStr).replace(/[^0-9]/g, ''); // Redundant if input is controlled, but safe
        if (cleanedStr === '') return null;
        return parseFloat(cleanedStr);
    };

    const filters = {
      priceRange: {
        min: parsePriceForFilter(priceRange.min),
        max: parsePriceForFilter(priceRange.max),
      },
      categories: selectedCategories,
      // Removed highlights, colors, rating from the filters object
    };
    
    if (memoizedOnFilterChange) {
        memoizedOnFilterChange(filters);
    }
  }, [priceRange, selectedCategories, memoizedOnFilterChange]);


  return (
    <aside className="sidebar-filters">
      <FilterSection title="Lọc theo danh mục">
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
            type="text" // Keep as text to allow formatted display
            name="min"
            placeholder="Thấp nhất ₫"
            value={formatDisplayPrice(priceRange.min)} // Display formatted value
            onChange={handlePriceInputChange} // Updates state with raw numeric string
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="text"   
            name="max"
            placeholder="Cao nhất ₫"
            value={formatDisplayPrice(priceRange.max)} // Display formatted value
            onChange={handlePriceInputChange} // Updates state with raw numeric string
            className="price-input"
          />
        </div>
      </FilterSection>

      {/* Sections for Highlights, Colors, and Rating have been removed */}
    </aside>
  );
};

export default SidebarFilter;