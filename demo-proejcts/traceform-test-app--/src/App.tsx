import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import { Button, MemoizedButton } from './components/Button';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Traceform Test App</h1>

        <Card title="Primary Card">
          <p>This card contains various buttons for testing.</p>
          <Button onClick={() => setCount((c) => c + 1)}>
            Increment Count ({count})
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary Action!')}>
            Secondary Action
          </Button>
          <MemoizedButton onClick={() => alert('Memoized Button Clicked!')}>
            Memoized Button
          </MemoizedButton>
        </Card>

        <Card title="Another Card">
          <p>Another section with more components.</p>
          <Button onClick={() => alert('Another Primary Button')}>
            Another Primary
          </Button>
        </Card>

        <p className="read-the-docs">
          Use the VS Code extension to highlight components on this page.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
