import React from 'react';
import './StockCard.css';

export const StockCard: React.FC<{
  stock: { symbol: string; name: string; price: number };
  onBuySell: () => void;
}> = ({ stock, onBuySell }) => (
  <div className="stock-card">
    <div className="stock-info">
      <div className="stock-symbol">{stock.symbol}</div>
      <div className="stock-name">{stock.name}</div>
      <div className="stock-price">${stock.price.toFixed(2)}</div>
    </div>
    <button className="buy-sell-btn" onClick={onBuySell}>
      Buy / Sell
    </button>
  </div>
); 