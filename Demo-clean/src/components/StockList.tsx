import React from 'react';
import { StockCard } from './StockCard';
import './StockList.css';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 172.34 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2834.56 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3342.88 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 709.67 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 299.35 },
];

export const StockList: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => (
  <div className="stock-list">
    {STOCKS.map(stock => (
      <StockCard key={stock.symbol} stock={stock} onBuySell={() => onSelectStock(stock.symbol)} />
    ))}
  </div>
); 