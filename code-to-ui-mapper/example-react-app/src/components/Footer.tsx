import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-600 p-4 mt-8 border-t border-gray-200">
      <div className="container mx-auto text-center text-sm">
        &copy; {currentYear} Example App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
