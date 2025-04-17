import React from 'react';
import './Sidebar.css';

export const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <nav>
      <ul>
        <li className="active"><span role="img" aria-label="dashboard">🏠</span> Dashboard</li>
        <li><span role="img" aria-label="portfolio">💼</span> Portfolio</li>
        <li><span role="img" aria-label="market">📊</span> Market</li>
        <li><span role="img" aria-label="settings">⚙️</span> Settings</li>
      </ul>
    </nav>
  </aside>
); 