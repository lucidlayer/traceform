import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '10px 20px',
    borderTop: '1px solid #dee2e6',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#6c757d',
  };

  return (
    <footer style={footerStyle}>
      &copy; {new Date().getFullYear()} Traceform Test App. All rights reserved.
    </footer>
  );
};

export default Footer;
