import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the complex React example application!</p>
      <button onClick={() => console.log('Home button clicked!')}>Click Me</button>
    </div>
  );
};

export default HomePage;
