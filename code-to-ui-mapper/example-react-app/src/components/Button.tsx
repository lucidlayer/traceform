import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const primaryStyle = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
  const secondaryStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';

  const variantStyle = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
