import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Welcome Home!</h2>
      <Card title="Main Content">
        <p className="text-gray-600 mb-4">
          This is the main content area of the home page. You can place various
          components and information here.
        </p>
        <Button variant="primary" onClick={() => alert('Primary Action!')}>
          Primary Action
        </Button>
        <Button
          variant="secondary"
          className="ml-2"
          onClick={() => alert('Secondary Action!')}
        >
          Secondary Action
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Feature 1">
          <p className="text-gray-600">Details about feature one.</p>
          <Button className="mt-4">Learn More</Button>
        </Card>
        <Card title="Feature 2">
          <p className="text-gray-600">Details about feature two.</p>
           <Button className="mt-4">Learn More</Button> {/* Duplicate Button for testing */}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
