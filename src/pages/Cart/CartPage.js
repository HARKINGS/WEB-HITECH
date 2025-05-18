// src/pages/Cart/CartPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // Adjust path if needed
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'; // Icons for actions
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  // Helper to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00'; 
  }
  return `$${amount.toFixed(2)}`;
};

  return (
    <div className="cart-page">
      <div className="container">
        <h2>Giỏ hàng</h2>

        {cartItems.length === 0 ? (
          <div className="cart-empty-message">
            <p>Giỏ hàng của bạn đang trống!</p>
            <Link to="/shop" className="btn btn-primary">Mua sắm ngay!</Link>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-price">Giá</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-subtotal">Tổng cộng</th>
                    <th className="col-remove"></th> {/* For remove button */}
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="cart-item-row">
                      <td className="cart-item-product">
                        <Link to={`/products/${item.id}`} className="cart-item-image-link">
                           <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                        </Link>
                        <div className="cart-item-details">
                            <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                            {/* Add other details like color/size if available in item */}
                        </div>
                      </td>
                      <td className="cart-item-price" data-label="Price">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="cart-item-quantity" data-label="Quantity">
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn minus-btn"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1} // Optionally disable at 1
                          >
                            <FaMinus />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn plus-btn"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td className="cart-item-subtotal" data-label="Subtotal">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="cart-item-remove">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-item-btn"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Summary and Actions */}
            <div className="cart-summary-actions">
                {/* <div className="cart-actions">
                     <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
                     <button onClick={clearCart} className="btn btn-outline">Clear Cart</button>
                </div> */}

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    {/* Add rows for Shipping, Tax if applicable */}
                    <div className="summary-row total-row">
                        <span>Total:</span>
                        <span className="grand-total">{formatCurrency(cartTotal)}</span>
                    </div>
                    <Link to="/checkout" className="btn btn-primary btn-checkout">
                        Thanh toán
                    </Link>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;