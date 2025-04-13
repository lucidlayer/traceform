import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import useCart
import './Header.css';

const Header: React.FC = () => {
  const { getCartItemCount } = useCart(); // Use the hook

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1>MyStore</h1>
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li> {/* Placeholder link */}
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li> {/* Placeholder link */}
          </ul>
        </nav>
        <div className="header-actions">
          {/* Search bar, user icon, etc. can go here */}
          <input type="search" placeholder="Search..." className="search-input" />
          <Link to="/cart" className="cart-icon">
            🛒 <span className="cart-count">{getCartItemCount()}</span> {/* Display dynamic count */}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
