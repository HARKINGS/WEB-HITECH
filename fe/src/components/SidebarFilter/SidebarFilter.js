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

const BRANDS_DATA = [
    { id: 'Dell', name: 'Dell' },
    { id: 'Logitech', name: 'Logitech' },
    { id: 'Apple', name: 'Apple' },
    { id: 'LG', name: 'LG' },
];

const SidebarFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPriceRange(prev => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const formatDisplayPrice = (value) => {
    if (value === '' || value === null || value === undefined) return '';
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

  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(bId => bId !== brandId)
        : [...prev, brandId]
    );
  };

  const memoizedOnFilterChange = useCallback(onFilterChange, [onFilterChange]);

  useEffect(() => {
    const parsePriceForFilter = (priceStr) => {
      if (priceStr === '' || priceStr === null || priceStr === undefined) return null;
      const cleanedStr = String(priceStr).replace(/[^0-9]/g, '');
      if (cleanedStr === '') return null;
      return parseFloat(cleanedStr);
    };

    const filters = {
      priceRange: {
        min: priceRange.min ? parseFloat(priceRange.min) : null,
        max: priceRange.max ? parseFloat(priceRange.max) : null,
      },
      categories: selectedCategories,
      brands: selectedBrands,
    };

    if (memoizedOnFilterChange) {
      memoizedOnFilterChange(filters);
    }
  }, [priceRange, selectedCategories, selectedBrands, memoizedOnFilterChange]);

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

      <FilterSection title="Lọc theo hãng">
          <ul>
          {BRANDS_DATA.map(brand => (
              <li key={brand.id}>
              <label>
                  <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)} // selectedBrands là state
                  onChange={() => handleBrandChange(brand.id)} // handleBrandChange cập nhật selectedBrands
                  /> {brand.name}
              </label>
              </li>
          ))}
          </ul>
      </FilterSection>

      <FilterSection title="Lọc theo giá">
        <div className="price-input-group">
          <input
            type="text"
            name="min"
            placeholder="vd: 100.000"
            value={formatDisplayPrice(priceRange.min)}
            onChange={handlePriceInputChange}
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="text"
            name="max"
            placeholder="vd: 5.000.000"
            value={formatDisplayPrice(priceRange.max)}
            onChange={handlePriceInputChange}
            className="price-input"
          />
        </div>
      </FilterSection>
    </aside>
  );
};

export default SidebarFilter;