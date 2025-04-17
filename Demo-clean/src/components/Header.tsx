import React from 'react';
import './Header.css';

export const Header: React.FC = () => (
  <header className="header">
    <div className="logo">📈</div>
    <h1 className="site-title">Stock Marketplace</h1>
    <button className="profile-btn">Profile</button>
  </header>
); 