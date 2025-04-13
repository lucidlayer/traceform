import React from 'react';
import Button from './Button';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Test App</h1>
      <nav>
        <Button variant="secondary" onClick={() => alert('Login clicked')}>
          Login
        </Button>
      </nav>
    </header>
  );
};

export default Header;
