import React from 'react';

interface CardProps {
  title: string;
  imageUrl: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, children }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Card;
