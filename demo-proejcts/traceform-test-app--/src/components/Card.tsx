import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0 0 10px 0',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
