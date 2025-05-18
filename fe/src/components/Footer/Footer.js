import React from 'react';
import './Footer.css';

import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa'; 
const Footer = () => {
  return (
    <footer className="site-footer">

      {/* Footer Widgets */}
      <div className="footer-widgets">
        <div className="container widgets-inner">
          {/* Widget 1: Our Information */}
          <div className="footer-widget">
            <h4>Về cửa hàng</h4>
            <p>
            Chào mừng đến với cửa hàng của chúng tôi, nơi chúng tôi tự hào cung cấp các sản phẩm đặc biệt và dịch vụ khách hàng tuyệt vời, phong cách và chất lượng.</p>
            {/* <div className="app-stores"> */}
              {/* <a href="#" target="_blank" rel="noopener noreferrer"><FaApple /> App Store</a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaGooglePlay /> Google Play</a> */}
            {/* </div> */}
          </div>

          {/* Widget Our Company */}
          <div className="footer-widget">
            <h4>Công ty</h4>
            <ul>
              <li><a href="/contact-us">Liên hệ chúng tôi</a></li>
              <li><a href="/shop">Cửa hàng</a></li>

            </ul>
          </div>

          {/* Widget 4: Your Account */}
          {/* <div className="footer-widget">
            <h4>Your Account</h4>
            <ul>
              <li><a href="#">Product Support</a></li>
              <li><a href="#">Checkout</a></li>
              <li><a href="#">License Policy</a></li>
              <li><a href="#">Affiliate</a></li>
              <li><a href="#">Order Tracking</a></li>
              <li><a href="#">Locality</a></li> 
            </ul> */
          /* </div> */}

           {/* Widget 5: Contact Us */}
           <div className="footer-widget contact-info">
             <h4>Liên hệ</h4>
             <p><i className="icon-map-pin"></i> {/* Icon */} Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
             <p><i className="icon-phone"></i> {/* Icon */} 024 3869 4242</p>
             <p><i className="icon-mail"></i> {/* Icon */} support@demo.com</p>
           </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container bottom-inner">
          <div className="social-links">
            <a href="https://www.facebook.com/dhbkhanoi"><FaFacebookF /></a>
            <a href="https://x.com/"><FaTwitter /></a>
            <a href="https://www.instagram.com/"><FaInstagram /></a>
            {/* Thêm các mạng xã hội khác */}
          </div>
          <div className="copyright">
            © 2025 HUST - Hanoi University of Science and Technology 
          </div>
          {/* <div className="payment-methods"> */}
            {/* Thêm ảnh các phương thức thanh toán */}
            {/* <img src="/path/to/visa.png" alt="Visa" />
            <img src="/path/to/mastercard.png" alt="Mastercard" />
            <img src="/path/to/paypal.png" alt="Paypal" /> */}
            {/* ... */}
          {/* </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;