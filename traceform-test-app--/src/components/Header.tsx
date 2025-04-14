import React from 'react';
import { Button } from './Button'; // Assuming Button component exists

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '10px 20px',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '1.2em',
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>Test App</div>
      <nav>
        <Button onClick={() => alert('Home clicked')}>Home</Button>
        <Button variant="secondary" onClick={() => alert('About clicked')}>About</Button>
      </nav>
    </header>
  );
};

export default Header;
