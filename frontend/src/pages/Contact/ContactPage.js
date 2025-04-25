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
        <h2>Contact Us</h2>

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
            <h3>Get In Touch With Us</h3>
            <p>If you wish to directly reach us, please fill out the form below -</p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your message (optional)</label>
                <textarea id="message" name="message" rows="5"></textarea>
              </div>
              <button type="submit" className="btn btn-submit">Submit</button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="contact-details">
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <strong>Address:</strong>
                <p>62 29th San Francisco, 807 - Union Trade Center</p>
              </div>
            </div>
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <strong>Call us:</strong>
                <p>(+91) 123-456-789</p> {/* Sử dụng số từ ảnh */}
              </div>
            </div>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <strong>Mail us:</strong>
                <p>demomail@example.com</p> {/* Sử dụng mail từ ảnh */}
              </div>
            </div>
            <div className="detail-item">
              <FaClock className="detail-icon" />
              <div>
                <strong>Open time:</strong>
                <p>Monday - Sunday: 8:00AM - 6:00PM</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;