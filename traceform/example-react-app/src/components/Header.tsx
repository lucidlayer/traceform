import React from 'react';
import Avatar from './Avatar';
import Button from './Button';

interface HeaderProps {
  onNavigate: (page: 'home' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Example App</h1>
        <nav className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => onNavigate('home')}>
            Home
          </Button>
          <Button variant="secondary" onClick={() => onNavigate('profile')}>
            Profile
          </Button>
          <Avatar
            src="https://via.placeholder.com/150/771796" // Placeholder image
            alt="User Avatar"
            size="sm"
            className="ml-4"
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
