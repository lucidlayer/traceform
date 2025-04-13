import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 p-4 text-center mt-8">
      &copy; {new Date().getFullYear()} Test App. All rights reserved.
    </footer>
  );
};

export default Footer;
