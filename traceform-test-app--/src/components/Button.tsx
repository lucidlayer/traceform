import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px',
  };

  const variantStyle = variant === 'primary'
    ? { backgroundColor: '#007bff', color: 'white' }
    : { backgroundColor: '#6c757d', color: 'white' };

  return (
    <button style={{ ...baseStyle, ...variantStyle }} {...props}>
      {children}
    </button>
  );
};

// Example of wrapping with React.memo for testing
const MemoizedButton = React.memo(Button);

export { Button, MemoizedButton };
