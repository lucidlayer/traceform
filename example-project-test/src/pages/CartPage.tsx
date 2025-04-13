import React from 'react';
import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../context/CartContext';
import './CartPage.css'; // We'll create this CSS file next

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // Ensure quantity is not negative
    updateQuantity(item.id, quantity);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="continue-shopping-link">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items-container">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
              <label htmlFor={`quantity-${item.id}`}>Qty:</label>
              <input
                id={`quantity-${item.id}`}
                type="number"
                min="1" // Allow setting to 0 via updateQuantity logic, but input starts at 1
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10))}
                className="quantity-input"
              />
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="remove-item-button"
              aria-label={`Remove ${item.name} from cart`}
            >
              &times; {/* Multiplication sign as 'X' */}
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${getCartTotal().toFixed(2)}</h3>
        </div>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
