import React, { useState, useEffect } from 'react';
import './SidebarFilter.css';
import { FaStar, FaRegStar } from 'react-icons/fa';

const FilterSection = ({ title, children }) => (
  <div className="filter-section">
    <h4 className="filter-title">{title}</h4>
    <div className="filter-content">{children}</div>
  </div>
);

const SidebarFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [highlightFilters, setHighlightFilters] = useState({
    promotion: false,
    newArrivals: false,
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value.replace(/[^0-9]/g, '')); // Loại bỏ ký tự không phải số trước khi parse

    if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
      setPriceRange(prev => ({
        ...prev,
        [name]: value, // Lưu dạng string, có thể chứa dấu phẩy, vd "100.000"
      }));
    }
  };

  const formatCurrency = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(String(value).replace(/[^0-9]/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('vi-VN'); // Định dạng số theo kiểu Việt Nam, vd: 100.000
  };


  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleHighlightChange = (e) => {
    const { name, checked } = e.target;
    setHighlightFilters(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const availableColors = [
    { name: 'Đỏ', code: '#ff0000' },
    { name: 'Xanh dương', code: '#0000ff' },
    { name: 'Xanh lá', code: '#008000' },
    { name: 'Vàng', code: '#ffff00' },
    { name: 'Đen', code: '#000000' },
    { name: 'Trắng', code: '#ffffff', border: true },
  ];

  const handleRatingChange = (rating) => {
    setSelectedRating(prevRating => (prevRating === rating ? 0 : rating));
  };

  useEffect(() => {
    const parsePrice = (priceStr) => {
        if (priceStr === '' || priceStr === null || priceStr === undefined) return null;
        // Loại bỏ tất cả các ký tự không phải là số (ví dụ: dấu chấm, dấu phẩy, chữ '₫')
        const cleanedStr = String(priceStr).replace(/[^0-9]/g, '');
        if (cleanedStr === '') return null;
        return parseFloat(cleanedStr);
    };

    const filters = {
      priceRange: {
        min: parsePrice(priceRange.min),
        max: parsePrice(priceRange.max),
      },
      categories: selectedCategories,
      highlights: highlightFilters,
      colors: selectedColors,
      rating: selectedRating,
    };
    // console.log("Filters updated (Vietnamese):", filters);
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [priceRange, selectedCategories, highlightFilters, selectedColors, selectedRating, onFilterChange]);

  const categoriesData = [
    { name: 'Cửa hàng', id: 'our-store' },
    { name: 'Điện thoại thông minh', id: 'smartphones' },
    { name: 'Laptop & Máy tính', id: 'laptops-computers' },
    { name: 'Ưu đãi đặc biệt', id: 'special-offer' },
    { name: 'Máy ảnh', id: 'cameras'},
    { name: 'TV & Âm thanh', id: 'tv-audio'},
    { name: 'Phụ kiện', id: 'accessories'},
  ];

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= count ? (
          <FaStar key={i} />
        ) : (
          <FaRegStar key={i} />
        )
      );
    }
    return stars;
  };

  return (
    <aside className="sidebar-filters">
      <FilterSection title="Lọc theo danh mục">
        <ul>
          {categoriesData.map(cat => (
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
      </FilterSection>

      <FilterSection title="Nổi bật">
         <div>
           <label>
             <input
               type="checkbox"
               name="promotion"
               checked={highlightFilters.promotion}
               onChange={handleHighlightChange}
             /> Khuyến mãi
           </label>
         </div>
         <div>
           <label>
             <input
               type="checkbox"
               name="newArrivals"
               checked={highlightFilters.newArrivals}
               onChange={handleHighlightChange}
             /> Hàng mới về
           </label>
         </div>
      </FilterSection>

      <FilterSection title="Lọc theo màu sắc">
        <div className="color-filter">
          {availableColors.map(color => (
            <span
              key={color.code}
              className={`color-swatch ${selectedColors.includes(color.code) ? 'active' : ''} ${color.border ? 'has-border' : ''}`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color.code)}
            ></span>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Lọc theo giá">
        <div className="price-input-group">
          <input
            type="text" // Đổi sang text để cho phép nhập dấu phẩy/chấm
            name="min"
            placeholder="Thấp nhất ₫"
            value={priceRange.min} // Sẽ hiển thị dạng đã format nếu muốn, nhưng state vẫn là chuỗi số
            onChange={handlePriceInputChange}
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="text"   
            name="max"
            placeholder="Cao nhất ₫"
            value={priceRange.max}
            onChange={handlePriceInputChange}
            className="price-input"
          />
        </div>
        <div className="price-display-text">
          Giá: {formatCurrency(priceRange.min) || '0'}₫ - {formatCurrency(priceRange.max) || 'Không giới hạn'}
          {priceRange.max && '₫'}
        </div>
      </FilterSection>

      <FilterSection title="Đánh giá trung bình">
        <div className="rating-filter">
          {[5, 4, 3, 2, 1].map(ratingValue => (
            <div
              key={ratingValue}
              className={`rating-option ${selectedRating === ratingValue ? 'selected' : ''}`}
              onClick={() => handleRatingChange(ratingValue)}
            >
              {renderStars(ratingValue)}
            </div>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};

export default SidebarFilter;