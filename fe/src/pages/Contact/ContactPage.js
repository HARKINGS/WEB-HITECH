import React from 'react';
import './ContactPage.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'; // Icons

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form (trong thực tế sẽ gọi API)
    alert('Form submitted (simulation)');
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Có thể thêm Breadcrumbs ở đây */}
        <h2>Liên hệ chúng tôi</h2>

        {/* Map Section */}
        <section className="contact-map">
          {/* Nhúng Google Map hoặc dùng thư viện map */}
          <div className="map-placeholder">
            {/* Thay bằng Map thực tế */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4506.410729496246!2d105.84248882068374!3d21.00410638998625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71294bf0ab%3A0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1744568409354!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
      
          </div>
        </section>

        <section className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-container">
            <h3>Kết nối cùng chúng tôi</h3>
            <p>Nếu khách hàng muốn liên hệ trực tiếp với chúng tôi, vui lòng điền vào mẫu dưới đây</p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Họ/ Tên</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Lời nhắn gửi (tùy chọn)</label>
                <textarea id="message" name="message" rows="5"></textarea>
              </div>
              <button type="submit" className="btn btn-submit">Gửi</button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="contact-details">
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <strong>Địa chỉ:</strong>
                <p>Số 1 Đại Cồ Việt</p>
              </div>
            </div>
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <strong>Số điện thoại liên hệ:</strong>
                <p>0123456789</p> {/* Sử dụng số từ ảnh */}
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <strong>Gửi mail đến chúng tôi:</strong>
                <p>huster@example.com</p> {/* Sử dụng mail từ ảnh */}
              </div>
            </div>
            <div className="detail-item">
              <FaClock className="detail-icon" />
              <div>
                <strong>Giờ làm việc:</strong>
                <p>Thứ 2 - Chủ Nhật: 8:00 sáng - 6:00 chiều</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;