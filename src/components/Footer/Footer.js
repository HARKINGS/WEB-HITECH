import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa'; // Ví dụ

const Footer = () => {
  return (
    <footer className="site-footer">

      {/* Footer Widgets */}
      <div className="footer-widgets">
        <div className="container widgets-inner">
          {/* Widget 1: Our Information */}
          <div className="footer-widget">
            <h4>Our Information</h4>
            <p>Welcome to our store, where we pride ourselves on providing exceptional products and unparalleled customer service our store style, quality.</p>
            {/* <div className="app-stores"> */}
              {/* <a href="#" target="_blank" rel="noopener noreferrer"><FaApple /> App Store</a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaGooglePlay /> Google Play</a> */}
            {/* </div> */}
          </div>

          {/* Widget 2: Products */}
          <div className="footer-widget">
            <h4>Products</h4>
            <ul>
              {/* <li><a href="#">Prices Drop</a></li>
              <li><a href="#">New Products</a></li>
              <li><a href="#">Best Sales</a></li> */}
              <li><a href="#">Ví trí</a></li>
              <li><a href="#">Cửa hàng</a></li>
            </ul>
          </div>

          {/* Widget 3: Our Company */}
          <div className="footer-widget">
            <h4>Our Company</h4>
            <ul>
              {/* <li><a href="#">Delivery</a></li> */}
              {/* <li><a href="#">Legal Notice</a></li> */}
              {/* <li><a href="#">Terms And Conditions</a></li> */}
              <li><a href="#">Liên hệ chúng tôi</a></li>
              {/* <li><a href="#">Secure Payment</a></li> */}
              {/* <li><a href="#">My Account</a></li> */}
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
             <h4>Contact Us</h4>
             <p><i className="icon-map-pin"></i> {/* Icon */} 62 29th Street San Francisco, 807 Union Trade Center, United States America - 94110</p>
             <p><i className="icon-phone"></i> {/* Icon */} (+91) 012-345-6789</p>
             <p><i className="icon-mobile"></i> {/* Icon */} (+91) 9876-543-210</p>
             <p><i className="icon-mail"></i> {/* Icon */} support@demo.com</p>
           </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container bottom-inner">
          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            {/* Thêm các mạng xã hội khác */}
          </div>
          <div className="copyright">
            © 2025 Hanoi University of Science and Technology 
          </div>
          <div className="payment-methods">
            {/* Thêm ảnh các phương thức thanh toán */}
            {/* <img src="/path/to/visa.png" alt="Visa" />
            <img src="/path/to/mastercard.png" alt="Mastercard" />
            <img src="/path/to/paypal.png" alt="Paypal" /> */}
            {/* ... */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;