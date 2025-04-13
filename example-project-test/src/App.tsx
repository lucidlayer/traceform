import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import Card from './components/Card';
// Import placeholder image - assuming it exists or will be added later
// import placeholderSvg from './assets/placeholder.svg';
import './App.css'; // Assuming default Vite CSS exists

const App: React.FC = () => {
  // Use a generic placeholder URL if the SVG isn't available yet
  const imageUrl = /* placeholderSvg || */ 'https://via.placeholder.com/300x200.png?text=Placeholder';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Welcome to the Test App</h2>
        <p className="mb-4">This app demonstrates various components.</p>

        <div className="mb-6">
          <h3 className="text-xl mb-2">Buttons</h3>
          <div className="flex space-x-4">
            <Button onClick={() => alert('Primary clicked!')}>Primary Button</Button>
            <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>Secondary Button</Button>
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-2">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Card 1" imageUrl={imageUrl}>
              <p>This is the content for the first card.</p>
              <Button className="mt-2">Learn More</Button>
            </Card>
            <Card title="Card 2" imageUrl={imageUrl}>
              <p>Some different content for the second card.</p>
               <Button variant="secondary" className="mt-2">Details</Button>
            </Card>
             <Card title="Card 3" imageUrl={imageUrl}>
              <p>And the final card's description goes here.</p>
               <Button className="mt-2">View</Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
